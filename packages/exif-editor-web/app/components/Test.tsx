import * as React from 'react'

export default class Test extends React.Component {
  state = {changed: false}

  componentDidMount() {
    setTimeout(() => {
      this.setState({changed: true})
    }, 2000)
  }

  render() {
    return (
      <div style={{color: '#00f'}}>{this.state.changed ? 'Hello ccc' : 'Hello world'}</div>
    )
  }
}