import * as React from 'react'

type TestState = {changed: boolean}

export default class Test extends React.Component<{}, TestState> {
  state: TestState = {changed: false}

  componentDidMount(): void {
    setTimeout(() => {
      this.setState({changed: true})
    }, 2000)
  }

  render(): JSX.Element {
    return (
      <div style={{color: '#00f'}}>{this.state.changed ? 'Hello ccc' : 'Hello world'}</div>
    )
  }
}
