import * as React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;

  img {
    display: block;
    width: 100%;
  }
`

interface ImageProps {
  src: string
  alt: string
}

export default class Image extends React.Component<ImageProps> {
  render() {
    const {src, alt} = this.props

    return (
      <Wrapper>
        <img src={src} alt={alt} title={alt} />
      </Wrapper>
    )
  }
}