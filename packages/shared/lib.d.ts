declare module 'piexifjs' {
  interface ExifObj {}

  export function load(jpegData: string): ExifObj
}