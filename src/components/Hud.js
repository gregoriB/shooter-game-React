import React, { Component } from 'react'

class Hud extends Component {
  render() {
    return (
      <div className='hud'>
        Player Health: {this.props.playerHealth}
      </div>
    )
  }
}

export default Hud;
