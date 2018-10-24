import * as React from 'react'
import {getImageInfo, updateExif, ImageInfo} from '~/shared'
import styled, {createGlobalStyle, ThemeProvider, ThemeInterface} from './styled'
import Input from './components/Input'
import Image from './components/Image'
import Info from './components/Info'

const GlobalStyle = createGlobalStyle`
body, div, p {
  margin: 0;
  padding: 0;
}
`

const Wrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  font-size: 18px;
`

interface AppState {
  targetImage?: ImageInfo
  changed: boolean
}

const theme: ThemeInterface = {
  primaryColor: '#003bff',
  primaryColorInverted: '#fff',
}

export default class App extends React.Component<{}, AppState> {
  readonly state: AppState = {
    changed: false,
  }

  changedMap: Map<number, any> = new Map()

  handleFileSelect = (f: File) => {
    getImageInfo(f).then(image => {
      this.setState({
        targetImage: image,
      })
    })
  }

  handleInfoChange = (id: number, value: any) => {
    this.changedMap.set(id, value)
    this.setState({changed: true})
  }

  handleSaveImage = () => {
    const {targetImage} = this.state
    const newImageInfo = updateExif(targetImage!, this.changedMap)

    this.setState({
      changed: false,
      targetImage: newImageInfo,
    })
  }

  render() {
    const {targetImage, changed} = this.state

    return (
      <ThemeProvider theme={theme}>
        <Wrapper>
          {targetImage && <Image src={targetImage.datauri} alt={targetImage.name} />}
          <Input onSelect={this.handleFileSelect} />
          {targetImage && <Info exif={targetImage.exif} onInfoChange={this.handleInfoChange} />}
          {changed && <button onClick={this.handleSaveImage}>save</button>}
          <GlobalStyle />
        </Wrapper>
      </ThemeProvider>
    )
  }
}