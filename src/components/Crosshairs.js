import React, { Component } from 'react';

class Crosshairs extends Component {

  render() {
    return (
      <div className='crosshairs'
        style={{
          display: this.props.crosshairDisplay,
          top: this.props.crosshairPos[1],
          left: this.props.crosshairPos[0]
        }}
      />
    )
  }
}

export default Crosshairs;