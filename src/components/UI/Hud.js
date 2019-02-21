import React, { Component } from 'react'

class Hud extends Component {

  shouldComponentUpdate(nextProps) {
    if (nextProps.health === this.props.health) return false;

    return true;
  }

  render() {
    return (
      <div className='hud'>
        Player Health: {this.props.health}
      </div>
    )
  }
}

export default Hud;
