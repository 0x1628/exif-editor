import * as React from 'react'
import {getImageInfo, updateExif, ImageInfo, clearExif} from '~/shared'
import styled, {createGlobalStyle, ThemeProvider, ThemeInterface} from './styled'
import Input from './components/Input'
import Image from './components/Image'
import Info from './components/Info'
import Functions from './components/Functions'

const GlobalStyle = createGlobalStyle`
body, div, p {
  margin: 0;
  padding: 0;
}

html {
  height: 100%;
}

body {
  min-height: 100%;
}

body, input, button {
  font-family: sans-serif;
}

body, div {
  display: flex;
  flex-direction: column;
}

#root {
  flex: 1;
}
`

const Wrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  font-size: 18px;
  flex: 1;
  padding-bottom: 50px;
`

export interface AppState {
  targetImage?: ImageInfo
  changed: boolean
}

const theme: ThemeInterface = {
  primaryColor: '#003bff',
  primaryColorInverted: '#fff',
  successColor: '#00ffc3',
  successColorInverted: '#fff',
  warnColor: '#ffcf00',
  warnColorInverted: '#fff',
  errorColor: '#ff8e8e',
  errorColorInverted: '#fff',
  grey: '#8298b2',
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

  handleClearExif = () => {
    const newImageInfo = clearExif(this.state.targetImage!)
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
          {!targetImage && <Input onSelect={this.handleFileSelect} />}
          {targetImage && <Info exif={targetImage.exif} onInfoChange={this.handleInfoChange} />}
          {targetImage &&
          <Functions
            changed={changed}
            onSelect={this.handleFileSelect}
            onClear={this.handleClearExif}
            onSave={this.handleSaveImage}
          />
          }
          <GlobalStyle />
        </Wrapper>
      </ThemeProvider>
    )
  }
}