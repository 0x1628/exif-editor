import * as React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`

`

interface EditableProps {
  disabled: boolean
  id: number
  value: string
  displayValue?: string
  type: string
  onChange(id: number, value: string): void
}

interface EditableStates {
  editing: boolean
}

export default class Editable extends React.Component<EditableProps, EditableStates> {
  static defaultProps = {
    type: 'text',
    disabled: false,
  }

  state = {editing: false}
  input: HTMLInputElement | null = null

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    this.props.onChange(this.props.id, this.input!.value)
  }

  handleToggleEditing = () => {
    if (this.props.disabled) return
    if (this.state.editing) return
    this.setState({editing: !this.state.editing})
  }

  render() {
    const {type, value, displayValue} = this.props
    const {editing} = this.state

    return (
      <Wrapper onClick={this.handleToggleEditing}>
        {editing ?
        <form onSubmit={this.handleSubmit}>
          <input
            defaultValue={value}
            type={type}
            onBlur={this.handleSubmit}
            ref={el => this.input = el}
          />
        </form>
        : (displayValue || value)
        }
      </Wrapper>
    )
  }
}