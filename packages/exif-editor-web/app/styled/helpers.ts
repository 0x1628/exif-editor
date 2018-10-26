import styled, {css} from './index'

export function simpleCenterVertical(height: number) {
  return `
    height: ${height}px;
    line-height: ${height}px;
  `
}

const sizes = {
  desktop: 600,
}

const media = Object.keys(sizes).reduce((result: any, next) => {
  result[next] = (str: TemplateStringsArray, ...args: any[]) => css`
    @media (min-width: ${(<any>sizes)[next]}px) {
      ${css(str, ...args)}
    }
  `
  return result
}, {})

export {sizes, media}