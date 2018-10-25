import * as React from 'react'
import {render} from 'react-dom'
import App, {AppState} from './App'
import {cache} from './simple-persistent-cache'

let persistCache: AppState | null = null
function updatePersist(data: AppState) {
  persistCache = {...data}
}

const cached = cache()

render(cached(<App />), document.getElementById('root'))

if ((module as any).hot) {
  (module as any).hot.accept('./App.tsx', () => {
    // tslint:disable-next-line
    const NewApp = require('./App').default
    render(cached(<NewApp />), document.getElementById('root'))
  })
}