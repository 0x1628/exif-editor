import * as React from 'react'
import styled from 'styled-components'
import exifConfig from '../exif-config'
import Editable from './Editable'

const Table = styled.table`
  width: 100%;
`

interface InfoProps {
  exif: any
  onInfoChange(id: number, value: any): void
}

export default class Info extends React.PureComponent<InfoProps> {
  state = {}

  calcExif() {
    const {exif} = this.props

    const flattenExif = Object.keys(exif).reduce((result, next) => {
      if (typeof exif[next] !== 'object') return result
      return {
        ...result,
        ...exif[next],
      }
    }, {})

    const target = []
    for (const [key, value] of exifConfig) {
      if (flattenExif[key]) {
        let exifValue = flattenExif[key]
        if (value.transform) {
          exifValue = value.transform(exifValue)
        }
        target.push({
          key,
          ...value,
          value: exifValue,
          displayValue: value.valueDescriptor ?
            value.valueDescriptor(exifValue) : exifValue,
        })
      }
    }
    return target
  }

  handleChange = (id: number, value: any) => {
    this.props.onInfoChange(id, value)
  }

  render() {
    const exifInfo = this.calcExif()

    return (
      <Table>
        <tbody>
          {exifInfo.map(item => (
            <tr key={item.key}>
              <th>{item.label}</th>
              <td>
                <Editable
                  value={item.value}
                  id={item.key}
                  displayValue={item.displayValue}
                  disabled={!item.writable}
                  onChange={this.handleChange}
                  type={item.editType}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )
  }
}