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
  const fiberNode = (c as any)._reactInternalFiber

  const result = [fiberNode.index]
  let child = fiberNode.child
  while (child) {
    result.push(child.index)
    child = child.child
  }
  return result.join('.')
}

function findStateFulComponent(root: React.Component): React.Component[] {
  return findAllInRenderedTree(root,
    i => i && i instanceof React.Component && Boolean(i.state)) as React.Component[]
}

function saveStatefulComponent(targetMap: Map<any, any>, root: React.Component) {
  targetMap.clear()
  const result = findStateFulComponent(root)

  result.forEach((c, index) => {
    // TODO instance fingerprint
    // temp use index
    // targetMap.set(getComponentFingerprint(c, index), c.state)
    targetMap.set(index, c.state)
  })
}

function updateComponentWithCache(root: React.Component, data: Map<any, any>, plus = 0) {
  const targets = findStateFulComponent(root)
  if (targets[plus]) {
    targets[plus].setState(data.get(plus), () => {
      updateComponentWithCache(root, data, plus + 1)
    })
  }

}

export function cache() {
  const cachedMap: Map<number, any> = new Map()

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

      saveStatefulComponent(cachedMap, this.node!)
    }

    // only run when hot reload
    componentDidUpdate() {
      // temp lock for prevent changeCallback
      this.lock = true

      updateComponentWithCache(this.node!, cachedMap)
      const updated = findStateFulComponent(this.node!)

      updated.forEach((c, index) => {
        const fingerprint = getComponentFingerprint(c)
        // const state = cachedMap.get(fingerprint)
        const state = cachedMap.get(index)
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