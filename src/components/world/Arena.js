import React, { Component } from 'react';
import { audio } from '../../data/audio/audio';
import { gameData } from '../../data/game/gameData';
import { PlayerContext } from '../../contexts/PlayerContext';
import Crosshairs from '../UI/Crosshairs';
import Enemies from '../enemies/EnemyGrunts';
import Hud from '../UI/Hud';
import Player from '../player/Player';

export default class Arena extends Component {

  state = {
    crosshairPos: [100, 100],
    crosshairDisplay: 'none'
  }

  fireInterval = false;
  interval;
  isShooting = false;

  handleFireGun = () => {
    gameData.isShooting = true;
    audio.shoot1.currentTime = 0;
    audio.shoot1.play();
    this.setState({ crosshairDisplay: 'inline-block' });
    setTimeout(() => this.setState({ crosshairDisplay: 'none' }), 50);
    setTimeout(() => gameData.isShooting = false, 60);
  }

  handleAutomaticFire = () => {
    if (this.fireInterval) return;

    this.handleFireGun();
    this.fireInterval = setInterval(() => this.handleFireGun(), 150);
  }

  handleStopFiring = () => {
    clearInterval(this.fireInterval);
    this.fireInterval = false;
  }

  handleUpdateCrosshairPos = e => {
    const outerDiv = document.getElementsByClassName('arena')[0].getBoundingClientRect();
    const newCrosshairPos = [e.clientX - (outerDiv.left + 4), e.clientY - (outerDiv.top + 4)];
    this.setState({ crosshairPos:  newCrosshairPos});
  }

  shouldComponentUpdate() { return false }

  componentDidMount() {
    this.interval = setInterval(() => this.forceUpdate(), gameData.frameRate);
    document.addEventListener('mousemove', this.handleUpdateCrosshairPos);
    audio.shoot1.volume = .1;
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleUpdateCrosshairPos);
    clearInterval(this.interval);
  }

  render() {

    const { crosshairPos, crosshairDisplay } = this.state,
          { handleAutomaticFire, handleStopFiring, isFiring } = this;

    return (
      <div 
        className='arena' 
        onMouseDown={handleAutomaticFire}
        onMouseUp={handleStopFiring}
      >
        <PlayerContext.Consumer>
          {player => (
            <>
              <Hud {...player} />
              <Player {...player} />
              <Enemies 
                {...player} 
                crosshairPos={crosshairPos}
                isShooting={isFiring}
              />
              <Crosshairs 
                crosshairPos={crosshairPos}
                crosshairDisplay={crosshairDisplay}
              />
            </>
          )}
        </PlayerContext.Consumer>
      </div>
    )
  }
}