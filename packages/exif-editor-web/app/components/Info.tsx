import * as React from 'react'
import styled from 'styled-components'
import {parseImageExif} from '~/shared'
import Editable from './Editable'

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;

  tr + tr {
    border-top: 1px solid #ddd;
  }

  tr:nth-child(2n) {
    background: #eaefff;
  }

  td, th {
    padding: 5px 0;
    line-height: 1.3;
  }

  th {
    font-size: 12px;
    color: #666;
    font-weight: 400;
    padding-left: 10px;
    padding-right: 10px;
  }

  td {
    font-size: 14px;
    line-height: 20px;
  }

  input {
    font-size: 14px;
    padding: 0;
    margin: 0;
    border: 0;

    &:focus {
      outline: none;

      box-shadow: 0 0 4px rgba(0, 59, 255, .4);
    }
  }
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