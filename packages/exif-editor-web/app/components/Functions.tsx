import * as React from 'react'
import styled, {css} from '../styled'
import {media} from '../styled/helpers'
import Input from './Input'

const buttonClassName = 'Functions-button'

const Wrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, .1);
  flex-direction: row;
  padding: 8px 12px;

  .${buttonClassName} {
    height: auto;
    line-height: 1;
    border: 0;
    padding: 8px 10px;
    width: auto;
    border-radius: 6px;
    font-size: 13px;
    min-width: auto;
    margin-right: 10px;
    background: ${props => props.theme.grey}
    color: #fff
  }

  ${media.desktop`
    position: relative;
    box-shadow: none;
  `}
`

const Button = styled.button.attrs({className: buttonClassName})``
const HighlightButton = styled(Button)`
  background: ${props => props.theme.primaryColor}!important;
`

const WrapedInput = styled(Input).attrs({className: buttonClassName})``

interface FunctionsProps {
  changed: boolean
  onSelect(f: File): void
  onClear(): void
  onSave(): void
}

export default class Functions extends React.Component<FunctionsProps> {
  static defaultProps: Partial<FunctionsProps> = {
    changed: false,
  }

  render(): JSX.Element {
    const {changed, onSelect, onClear, onSave} = this.props

    return (
      <Wrapper>
        <WrapedInput onSelect={onSelect} content="reselect" />
        <Button onClick={onClear}>clear all</Button>
        {changed && <HighlightButton onClick={onSave}>save</HighlightButton>}
      </Wrapper>
    )
  }
}
