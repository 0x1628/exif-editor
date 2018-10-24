import * as React from 'react'
import {createGlobalStyle} from 'styled-components'
import {getImageInfo, updateExif, ImageInfo} from '~/shared'
import Input from './components/Input'
import Image from './components/Image'
import Info from './components/Info'

const GlobalStyle = createGlobalStyle`
body, div, p {
  margin: 0;
  padding: 0;
}
`

interface AppState {
  targetImage?: ImageInfo
  changed: boolean
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
      <div>
        {targetImage && <Image src={targetImage.datauri} />}
        <Input onSelect={this.handleFileSelect} />
        {targetImage && <Info exif={targetImage.exif} onInfoChange={this.handleInfoChange} />}
        {changed && <button onClick={this.handleSaveImage}>save</button>}
        <GlobalStyle />
      </div>
    )
  }
}