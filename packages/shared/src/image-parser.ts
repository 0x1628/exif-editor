import * as piexifjs from 'piexifjs'
// tslint:disable-next-line
import cloneDeep = require('lodash/cloneDeep')
import exifConfig, { ExifConfig } from './exif-config'
import {setDeep} from './utils'

export interface Exif extends ExifConfig {
  key: number
  label: string
  value: any
  displayValue: any
}

export interface ImageInfo {
  name: string,
  datauri: string,
  origin: {
    datauri: string,
    exif: any,
  }
  exif: any,
}

export async function getImageInfo(target: File): Promise<ImageInfo> {
  return new Promise<ImageInfo>((resolve, reject) => {
    if (typeof document !== 'undefined') { // browser
      const reader = new FileReader()

      reader.onload = (e: Event) => {
        if (e.target) {
          const result = (e.target as any).result
          const exif = piexifjs.load(result)
          delete exif.thumbnail
          resolve({
            name: target.name,
            datauri: result,
            exif,
            origin: {
              datauri: result,
              exif,
            },
          })
        } else {
          reject('load result empty???')
        }
      }

      reader.onerror = () => {
        reject('load error')
      }

      reader.readAsDataURL(target)
    } else {
      // TODO
      reject('node.js not implements')
    }
  })
}

export function parseImageExif(exif: any): Map<number, Exif> {
  const flatten = Object.keys(exif).reduce((result, next) => {
    return {
      ...result,
      ...exif[next],
    }
  }, {})

  const target = new Map()
  for (const [key, config] of exifConfig) {
    if (flatten[key]) {
      let exifValue = flatten[key]
      if (config.transform) {
        exifValue = config.transform(exifValue)
      }
      target.set(key, {
        key,
        ...config,
        value: exifValue,
        displayValue: config.valueDescriptor ?
          config.valueDescriptor(exifValue) : exifValue,
      })
    }
  }

  return target
}

export function updateExif(image: ImageInfo, target: Map<number, any>): ImageInfo {
  const exif = cloneDeep(image.exif)

  const setTransformer = (key: number, ov: any) => {
    const {detransform} = exifConfig.get(key)!
    if (detransform) {
      return detransform(ov)
    }
    return ov
  }

  for (const [key, value] of target) {
    setDeep(exif, key, value, ov => setTransformer(key, ov))
    const {dunplications} = exifConfig.get(key)!
    if (dunplications) {
      dunplications.forEach(k => setDeep(exif, k, value, ov => setTransformer(key, ov)))
    }
  }

  const exifbytes = piexifjs.dump(exif)
  const datauri = piexifjs.insert(exifbytes, image.datauri)

  return {
    ...image,
    datauri,
    exif,
  }
}

export function clearExif(image: ImageInfo): ImageInfo {
  return {
    ...image,
    exif: {},
    datauri: piexifjs.remove(image.datauri),
  }
}