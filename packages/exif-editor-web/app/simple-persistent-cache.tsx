import * as React from 'react'
import {findDOMNode} from 'react-dom'

export interface CachedComponentProps<P> {
  cache: {
    data: P,
    update(data: P): void,
  }
}

function subEqual(a: any, b: any): boolean {
  if (!a && !b) return true
  if (!a || !b) return false

  const na: any[] = []
  const nb: any[] = []

  Object.entries(a).forEach(([key, value]) => {
    if (typeof b[key] !== undefined) {
      na.push([key, value])
      nb.push([key, b[key]])
    }
  })
  return JSON.stringify(na) === JSON.stringify(nb)
}

export function cache() {
  let cached: any = null

  class CachedWrapper extends React.Component {
    node: React.Component | null = null
    observer: MutationObserver | null = null
    needReset = false

    componentDidMount() {
      const el = findDOMNode(this.node!)

      const observer = this.observer = new MutationObserver(this.changeCallback)
      observer.observe(el!, {attributes: true, childList: true, subtree: true})
    }

    componentDidUpdate() {
      if (!subEqual(cached, this.node!.state)) {
        this.node!.setState(cached)
      }
    }

    componentWillUnmount() {
      if (this.observer) {
        this.observer.disconnect()
      }
    }

    changeCallback = () => {
      const targetState = this.node!.state
      cached = targetState
    }

    render() {
      return React.cloneElement(this.props.children as React.ReactElement<any>, {
        // definitely is Component
        ref: (el: React.Component) => { this.node = el },
      })
    }
  }

  return (element: React.ReactElement<any>) => {
    if (process.env.NODE_ENV === 'production') return element
    return (<CachedWrapper>{element}</CachedWrapper>)
  }
}