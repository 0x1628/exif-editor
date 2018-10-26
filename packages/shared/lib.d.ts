declare module 'piexifjs' {
  interface ExifObj {[k: string]: any}

  export function load(jpegData: string): ExifObj
  export function dump(exif: ExifObj): any
  export function insert(exifbytes: any, image: string): string
  export function remove(image: string): string
}