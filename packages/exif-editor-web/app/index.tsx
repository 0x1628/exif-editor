import * as React from 'react'
import {render} from 'react-dom'
import App, {AppState} from './App'
import {persist} from 'react-state-persist'

let persistCache: AppState | null = null
function updatePersist(data: AppState) {
  persistCache = {...data}
}

const cached = persist()

render(cached(<App />), document.getElementById('root'))

if ((module as any).hot) {
  (module as any).hot.accept('./App.tsx', () => {
    // tslint:disable-next-line
    const NewApp = require('./App').default
    render(cached(<NewApp />), document.getElementById('root'))
  })
}

if ('serviceWorker' in navigator && location.search.indexOf('source=pwa') !== -1) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', {scope: './'}).then(() => {
      //
    }, () => {
      // console.log('error')
    })
  })
}