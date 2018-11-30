import React, { Component } from 'react'
import { PlayerContext } from '../contexts/PlayerContext';
import { EnemyContext } from '../contexts/EnemiesContext';
import Player from './Player';
import Enemies from './Enemies';
import Hud from './Hud';
import Crosshairs from './Crosshairs';
import { audio } from '../helpers/audio'

export default class Arena extends Component {

  state = {
    crosshairPos: [100, 100],
    crosshairDisplay: 'none'
  }

  fireInterval = false;

  handleFireGun = () => {
    audio.shoot1.currentTime = 0;
    audio.shoot1.play();
    this.setState(() => ({ crosshairDisplay: 'inline-block' }));
    setTimeout(() => {this.setState(() => ({ crosshairDisplay: 'none' }))}, 50);
  }

  handleAutomaticFire = (e) => {
    if (this.fireInterval) {
      return;
    }
    this.handleFireGun();
    this.fireInterval = setInterval(() => this.handleFireGun(), 150);
  }

  handleStopFiring = () => {
    clearInterval(this.fireInterval);
    this.fireInterval = false;
  }

  handleUpdateCrosshairPos = (e) => {
    const outerDiv = document.getElementsByClassName('arena')[0].getBoundingClientRect();
    const newCrosshairPos = [e.clientX - (outerDiv.left + 4), e.clientY - (outerDiv.top + 4)];
    this.setState(() => ({ crosshairPos:  newCrosshairPos}))
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleUpdateCrosshairPos)
    audio.shoot1.volume = .1;
  }

  render() {
    return (
      <div 
        className='arena' 
        onMouseDown={() => this.handleAutomaticFire()}
        onMouseUp={this.handleStopFiring}
      >
        <EnemyContext.Consumer>
          {enemies => (
            <PlayerContext.Consumer>
              {player => (
                <>
                  <Hud {...player} />
                  <Player {...player} />
                  <Enemies 
                    {...enemies} 
                    {...player} 
                    crosshairPos={this.state.crosshairPos}
                    firing={this.fireInterval}
                  />
                  <Crosshairs 
                    crosshairPos={this.state.crosshairPos}
                    crosshairDisplay={this.state.crosshairDisplay}
                  />
                </>
              )}
            </PlayerContext.Consumer>
          )}
        </EnemyContext.Consumer>
      </div>
    )
  }
}
