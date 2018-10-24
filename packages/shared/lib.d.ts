declare module 'piexifjs' {
  interface ExifObj {}

  export function load(jpegData: string): ExifObj
  export function dump(exif: ExifObj): any
  export function insert(exifbytes: any, image: string): string
}