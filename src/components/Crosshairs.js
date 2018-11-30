import React, { Component } from 'react';
import { crosshairs } from '../helpers/guns';

class Crosshairs extends Component {

  state = {
    crosshairPos: [100, 100],
    crosshairDisplay: 'none'
  }

  handleShootLaser = (e) => {
    const outerDiv = document.getElementsByClassName('arena')[0].getBoundingClientRect();
    const newCrosshairPos = [e.clientX - (outerDiv.left + 4), e.clientY - (outerDiv.top + 4)];
    // audio.shoot.currentTime = 0;
    // audio.shoot.play();
    this.setState(() => ({ crosshairPos: newCrosshairPos, crosshairDisplay: 'inline-block' }));
    setTimeout(() => {this.setState(() => ({ crosshairDisplay: 'none' }))}, 80);
  }

  render() {
    return (
      <div className='crosshairs'
        style={{
          display: this.state.crosshairDisplay,
          top: this.state.crosshairPos[1],
          left: this.state.crosshairPos[0]
        }}
      />
    )
  }
}

export default Crosshairs;