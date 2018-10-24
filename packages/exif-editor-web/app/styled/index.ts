import * as styledComponents from 'styled-components'

interface ThemeInterface {
  primaryColor: string
  primaryColorInverted: string
}

const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<ThemeInterface>

export {css, createGlobalStyle, keyframes, ThemeProvider, ThemeInterface}
export default styled