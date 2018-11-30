import React, { Component } from 'react'

class Hud extends Component {

  shouldComponentUpdate(nextProps) {
    if (nextProps.playerHealth === this.props.playerHealth) {
      return false;
    }

    return true;
  }

  render() {
    return (
      <div className='hud'>
        Player Health: {this.props.playerHealth}
      </div>
    )
  }
}

export default Hud;
