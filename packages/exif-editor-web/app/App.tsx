import * as React from 'react'
import {createGlobalStyle} from 'styled-components'
import {piexifjs} from '~/shared'
import Input from './components/Input'
import Image from './components/Image'
import Info from './components/Info'
import {deepSet} from './utils'
import exifConfig from './exif-config'

const GlobalStyle = createGlobalStyle`
body, div, p {
  margin: 0;
  padding: 0;
}
`

interface AppState {
  targetImage: string | null
  exif: any
  changed: boolean
}

export default class App extends React.Component<{}, AppState> {
  readonly state = {
    targetImage: null,
    exif: null,
    changed: false,
  }

  changedMap: Map<number, any> = new Map()

  handleFileSelect = (f: File) => {
    const reader = new FileReader()

    reader.onload = (re: Event) => {
      if (re.target) {
        const result = ((re.target as any).result)
        console.log(piexifjs.load(result))
        this.setState({
          targetImage: result,
          exif: piexifjs.load(result),
        })
      }
    }

    reader.readAsDataURL(f)
  }

  handleInfoChange = (id: number, value: any) => {
    this.changedMap.set(id, value)
    this.setState({changed: true})
  }

  handleSaveImage = () => {
    const {exif, targetImage} = this.state
    for (const [key, value] of this.changedMap) {
      deepSet(exif, key.toString(), value, (oValue: string) => {
        const detransform = exifConfig.get(key)!.detransform
        if (detransform) {
          return detransform(oValue)
        }
        return oValue
      })
    }
    const exifbytes = piexifjs.dump(exif)
    const image = piexifjs.insert(exifbytes, targetImage)
    this.setState({
      exif,
      changed: false,
      targetImage: image,
    })
  }

  render() {
    const {targetImage, exif, changed} = this.state

    return (
      <div>
        {targetImage && <Image src={targetImage} />}
        <Input onSelect={this.handleFileSelect} />
        {targetImage && <Info exif={exif} onInfoChange={this.handleInfoChange} />}
        {changed && <button onClick={this.handleSaveImage}>save</button>}
        <GlobalStyle />
      </div>
    )
  }
}