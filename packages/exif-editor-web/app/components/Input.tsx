import * as React from 'react'

interface InputProps {
  onSelect(f: File): void
}

export default class Input extends React.Component<InputProps> {
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {onSelect} = this.props
    const input = e.target

    if (input.files && input.files.length) {
      onSelect(input.files[0])
    }
  }

  render() {
    const {onSelect} = this.props
    return (
      <div className="Input">
        <input type="file" onChange={this.handleChange} />
      </div>
    )
  }
}