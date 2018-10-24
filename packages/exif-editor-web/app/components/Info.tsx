import * as React from 'react'
import styled from 'styled-components'
import {parseImageExif} from '~/shared'
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
    return parseImageExif(exif)
  }

  handleChange = (id: number, value: any) => {
    this.props.onInfoChange(id, value)
  }

  render() {
    const exifInfo = this.calcExif()

    return (
      <Table>
        <tbody>
          {Array.from(exifInfo).map(([key, item]) => (
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