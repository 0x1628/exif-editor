import * as React from 'react'
import {findDOMNode} from 'react-dom'
import {findAllInRenderedTree} from 'react-dom/test-utils'

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

function getComponentFingerprint(c: React.Component): string {
  return (c as any)._reactInternalFiber.index.toString()
}

function findStateFulComponent(root: React.Component): React.Component[] {
  return findAllInRenderedTree(root, 
    i => i && i instanceof React.Component && Boolean(i.state)) as React.Component[]
}

function saveStatefulComponent(targetMap: Map<any, any>, root: React.Component) {
  targetMap.clear()
  const result = findStateFulComponent(root)

  result.forEach(c => {
    // TODO instance fingerprint
    // temp use index
    targetMap.set(getComponentFingerprint(c), c.state)
  })
}

export function cache() {
  let cached: any = null
  const cachedMap: Map<string, any> = new Map()

  class CachedWrapper extends React.Component {
    node: React.Component | null = null
    observer: MutationObserver | null = null
    needReset = false
    lock = false // lock research state

    componentDidMount() {
      const el = findDOMNode(this.node!)

      const observer = this.observer = new MutationObserver(this.changeCallback)
      observer.observe(el!.parentNode!, {attributes: true, childList: true, 
        subtree: true, characterData: true})

      cachedMap.set(getComponentFingerprint(this.node!), cached)
      saveStatefulComponent(cachedMap, this.node!)
    }

    // only run when hot reload
    componentDidUpdate() {
      // temp lock for prevent changeCallback
      this.lock = true

      const updated = findStateFulComponent(this.node!)
      updated.forEach(c => {
        const fingerprint = getComponentFingerprint(c)
        const state = cachedMap.get(fingerprint)
        if (state) {
          // TODO make async
          c.setState(state)
        }
      })

      requestAnimationFrame(() => {
        this.lock = false
      })
    }

    componentWillUnmount() {
      if (this.observer) {
        this.observer.disconnect()
      }
    }

    changeCallback = () => {
      if (!this.lock) {
        saveStatefulComponent(cachedMap, this.node!)
      }
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