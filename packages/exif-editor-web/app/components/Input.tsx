import * as React from 'react'
import styled from '../styled'
import {simpleCenterVertical} from '../styled/helpers'

const Wrapper = styled.div`
  width: 80%;
  min-width: 200px;

  background: ${props => props.theme.primaryColor};
  color: ${props => props.theme.primaryColorInverted};

  ${simpleCenterVertical(50)}
  text-align: center;
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  margin: auto 0;

  &::before {
    content: attr(data-content);
  }

  input {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`

interface InputProps {
  content: string
  className?: string
  onSelect(f: File): void
}

export default class Input extends React.Component<InputProps> {
  static defaultProps = {
    content: 'Select image to begin',
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {onSelect} = this.props
    const input = e.target

    if (input.files && input.files.length) {
      onSelect(input.files[0])
    }
  }

  render() {
    const {onSelect, content, className} = this.props
    return (
      <Wrapper data-content={content} className={className}>
        <input type="file" onChange={this.handleChange} aria-label="upload image" />
      </Wrapper>
    )
  }
}