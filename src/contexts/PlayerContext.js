import React, { useState } from 'react';
import { audio } from '../data/audio/audio';

export const PlayerContext = React.createContext();

export function PlayerProvider(props) {
  const initialPlayerPos = [450, 300];

  const [playerPos, setPlayerPos] = useState(initialPlayerPos);
  const [playerHealth, setPlayerHealth] = useState(100);

  const playerData = {
    canMove: {
      left: true,
      right: true,
      up: true,
      down: true
    },
    isReady: true,
    size: 15,
    speed: 10, // larger is slower, 10 is the fastest.
    stride: 4, // how far the player moves with each move input. Also affects the movement speed.
    willMove: {
      left: false,
      right: false,
      up: false,
      down: false
    }
  }

  const playerFunctions = {
    playerMove: newPlayerPos => setPlayerPos(newPlayerPos),
    
    playerTakeDamage: damage => {
      const health = playerHealth;
      audio.hit2.volume = .1;
      audio.hit2.currentTime = 0;
      audio.hit2.play();
      if (!health || health - damage <= 0) return setPlayerHealth('DEAD');

      if (health > 0) setPlayerHealth(health - damage);
    }
  }

  return (
    <PlayerContext.Provider 
      value={{
        playerPos,
        setPlayerPos,
        playerHealth,
        setPlayerHealth,
        playerData,
        playerFunctions
      }}
    >
      {props.children}
    </PlayerContext.Provider>
  )
}