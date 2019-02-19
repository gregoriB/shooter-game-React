import React, { useContext, useEffect } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
// import { gameData } from '../../data/game/gameData';

export default function Player() {
  const playerContext = useContext(PlayerContext);

  const map = { height: 600, width: 900 };

  const handlePlayerMove = (index, orientation) => {
    let newPos = handleDiagonalMovements(index, orientation);
    newPos = handleBoundaryCheck(newPos);
    playerContext.playerMove(newPos);
  }

  const handleDiagonalMovements = (index, orientation) => {
    const newPos   = [...playerContext.pos],
          willMove = playerContext.willMove,
          stride   = playerContext.stride;
    if (willMove.right && willMove.up) {
      newPos.splice(0, 1, newPos[0] + stride/2);
      newPos.splice(1, 1, newPos[1] - stride/2);
    }
    else if (willMove.right && willMove.down) {
      newPos.splice(0, 1, newPos[0] + stride/2);
      newPos.splice(1, 1, newPos[1] + stride/2);
    }
    else if (willMove.left && willMove.up) {
      newPos.splice(0, 1, newPos[0] - stride/2);
      newPos.splice(1, 1, newPos[1] - stride/2);
    }
    else if (willMove.left && willMove.down) {
      newPos.splice(0, 1, newPos[0] - stride/2);
      newPos.splice(1, 1, newPos[1] + stride/2);
    } 
    else newPos.splice(index, 1, newPos[index] + orientation);
    
    return newPos;
  }

  const handleBoundaryCheck = oldPos => {
    const newPos = [...oldPos]
    const playerSize = playerContext.size * 2,
          width      = map.width,
          height     = map.height;
    if (newPos[0] < 0) newPos.splice(0, 1, 0);
    else if (newPos[1] < 0) newPos.splice(1, 1, 0);
    else if (newPos[0] > width - playerSize) newPos.splice(0, 1, width - playerSize);
    else if (newPos[1] > height - playerSize) newPos.splice(1, 1, height - playerSize);

    return newPos;
  }

  const handleKeyDown = e => {
    e.preventDefault();
    if (!playerContext.isReady) {

      return ( handleClearHorizontalMovement(), handleClearVerticalMovement() );
    }

    return handleDirections(e);
  }

   // using intervals for continous movement as a workaround to avoid key repeat from the operating system.
   // only the first keypress is registered and the interval continues until the key registers a 'keyup'.
   const handleDirections = e => {
    e.preventDefault();
    const canMove = playerContext.canMove
    let stride = playerContext.stride,
        index  = 0,
        direction;
    switch(e.key) {
      case 'ArrowRight':
      case 'd':
        if (canMove.right) {
          canMove.right = false;
          direction = 'right';
        }
        break;
      case 'ArrowLeft':
      case 'a':
        if (canMove.left) {
          canMove.left = false;
          stride = -stride;
          direction = 'left';
        }
        break;
      case 'ArrowDown':
      case 's':
        if (canMove.down) {
          canMove.down = false;
          index = 1;
          direction = 'down';
        }
        break;
      case 'ArrowUp':
      case 'w':
        if (canMove.up) {
          canMove.up = false;
          index = 1;
          stride = -stride;
          direction = 'up';
        };
        break;
      default:
        break;
    }

    return direction && handleDetermineMove(index, stride, direction)
  }

  const handleDetermineMove = (index, stride, direction) => {
    if (!index) handleClearHorizontalMovement();
    if (index) handleClearVerticalMovement();
    handlePlayerMove(index, stride);
    const speed    = playerContext.speed,
          willMove = playerContext.willMove,
          interval = setInterval(() => handlePlayerMove(index, stride), speed);
    switch(direction) {
      case 'right':
        willMove.right = interval;
        break;
      case 'left':
        willMove.left = interval;
        break;
      case 'down':
        willMove.down = interval;
        break;
      case 'up':
        willMove.up = interval;
        break;
      default:
        break;
    }
  }

   //removes the interval set to a key to stop movement and allows the key input to register again.  Also handles opposing directions.
  const handleKeyUp = e => {
    e.preventDefault();
    const stride   = playerContext.stride,
          canMove  = playerContext.canMove;
    switch(e.key) {
      case 'ArrowRight':
      case 'd':
        playerContext.clearMovementIntervals('right');
        canMove.right  = true;
        if (!canMove.left) return handleDetermineMove(0, -stride, 'left');
        break;
      case 'ArrowLeft':
      case 'a':
        playerContext.clearMovementIntervals('left');
        canMove.left  = true;
        if (!canMove.right) return handleDetermineMove(0, stride, 'right');
        break;
      case 'ArrowDown':
      case 's':
        playerContext.clearMovementIntervals('down');
        canMove.down  = true;
        if (!canMove.up) return handleDetermineMove(1, -stride, 'up');
        break;
      case 'ArrowUp':
      case 'w':
        playerContext.clearMovementIntervals('up');
        canMove.up  = true;
        if (!canMove.down) return handleDetermineMove(1, stride, 'down');
        break;
      default:
        break;
    }
  }

  const handleClearHorizontalMovement = () => {
    playerContext.clearMovementIntervals('right');
    playerContext.clearMovementIntervals('left');
  }

  const handleClearVerticalMovement = () => {
    playerContext.clearMovementIntervals('down');
    playerContext.clearMovementIntervals('up');
  }
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    }
  });

  return (
    <>
      <div              
        className='player'
        style={{
          color: 'white',
          background: 'black',
          padding: playerContext.size,
          position: 'absolute',
          left: playerContext.pos[0],
          top: playerContext.pos[1]
        }}
      />
    </>
  );
}