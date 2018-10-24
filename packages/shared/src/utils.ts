type Transformer = (value: any) => any

function set(obj: any, key: string | number, value: string, transformer?: Transformer): boolean {
  if (typeof obj === 'object') {
    if (Object.keys(obj).includes(key.toString())) {
      obj[key] = transformer ? transformer(value) : value
      return true
    }
    return Object.keys(obj).some(k => set(obj[k], key, value, transformer))
  }
  return false
}

export function setDeep<T>(obj: T, key: string | number, value: string, transformer?: Transformer): T {
  set(obj, key, value, transformer)
  return obj
}
