import * as React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
`

interface ImageProps {
  src: string
}

export default class Image extends React.Component<ImageProps> {
  render() {
    const {src} = this.props
    return (
      <Wrapper>
        <img src={src} />
      </Wrapper>
    )
  }
}