import React, { useState, useEffect } from 'react';
import { audio } from '../../data/audio/audio';
import { gameData } from '../../data/game/gameData';
// import Crosshairs from '../UI/Crosshairs';
// import Enemies from '../enemies/EnemyGrunts';
// import Hud from '../UI/Hud';
import Player from '../player/Player';

export default function Arena() {
  const [crosshairState, setCrosshairState] = useState({ crosshairPos: [100, 100], crosshairDisplay: 'none' })

  let interval;
  let fireInterval = false;
  // let isShooting = false;

  const handleFireGun = () => {
    gameData.isShooting = true;
    audio.shoot1.currentTime = 0;
    audio.shoot1.play();
    setCrosshairState({crosshairDisplay: 'inline-block'})
    setTimeout(() => setCrosshairState({crosshairDisplay: 'none'}), 50);
    setTimeout(() => gameData.isShooting = false, 60);
  }

  const handleAutomaticFire = () => {
    if (fireInterval) return;

    handleFireGun();
    fireInterval = setInterval(() => handleFireGun(), 150);
  }

  const handleStopFiring = () => {
    clearInterval(fireInterval);
    fireInterval = false;
  }

  const handleUpdateCrosshairPos = e => {
    const outerDiv = document.getElementsByClassName('arena')[0].getBoundingClientRect();
    const newCrosshairPos = [e.clientX - (outerDiv.left + 4), e.clientY - (outerDiv.top + 4)];
    setCrosshairState({ crosshairPos:  newCrosshairPos});
  }

  // shouldComponentUpdate() { return false }

  // useEffect(() => {
  //   // interval = setInterval(() => forceUpdate(), gameData.frameRate);
  //   // document.addEventListener('mousemove', handleUpdateCrosshairPos);
  //   // audio.shoot1.volume = .1;

  //   return () => {
  //     // document.removeEventListener('mousemove', handleUpdateCrosshairPos);
  //     // clearInterval(interval);
  //   }
  // });

  return (
    <div 
      className='arena' 
      // onMouseDown={handleAutomaticFire}
      // onMouseUp={handleStopFiring}
    >
        {/* <Hud /> */}
        <Player />
        {/* <Enemies crosshairPos={crosshairPos} isShooting={isFiring} /> */}
        {/* <Crosshairs crosshairPos={crosshairState.crosshairPos} crosshairDisplay={crosshairState.crosshairDisplay} /> */}
    </div>
  )
}
