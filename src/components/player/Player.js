import React, { useContext, useEffect } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
// import { gameData } from '../../data/game/gameData';

export default function Player() {
  const playerContext = useContext(PlayerContext);
  let map = { height: 600, width: 900 };

  const handlePlayerMove = (index, speed) => {
    let newPos = handleDiagonalMovements(index, speed);
    handleBoundaryCheck(newPos);
    console.log(newPos)
    playerContext.playerMove(newPos);
  }

  const handleBoundaryCheck = newPos => {
    const playerSize = playerContext.size * 2,
          width      = map.width,
          height     = map.height;
    if (newPos[0] < 0) newPos.splice(0, 1, 0);
    if (newPos[1] < 0) newPos.splice(1, 1, 0);
    if (newPos[0] > width - playerSize) newPos.splice(0, 1, width - playerSize);
    if (newPos[1] > height - playerSize) newPos.splice(1, 1, height - playerSize);
  }

  const handleDiagonalMovements = (index, speed) => {
    let newPos = [...playerContext.pos];
    const willMove = playerContext.willMove,
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
    else newPos.splice(index, 1, newPos[index] + speed);
    
    return newPos;
  }

  const handleKeyDown = e => {
    e.preventDefault();
    if (!playerContext.isReady) return handleClearMovement();

    handleDirections(e);
  }

   // using intervals for continous movement as a workaround to avoid key repeat from the operating system.
   // only the first keypress is registered and the interval continues until the key registers a 'keyup'.
   const handleDirections = e => {
    e.preventDefault();
    const stride = playerContext.stride;
    switch(e.key) {
      case 'ArrowRight':
      case 'd':
        handleDetermineMove(0, stride);
        break;
      case 'ArrowLeft':
      case 'a':
        handleDetermineMove(0, -stride);
        break;
      case 'ArrowDown':
      case 's':
        handleDetermineMove(1, stride);
        break;
      case 'ArrowUp':
      case 'w':
        handleDetermineMove(1, -stride);
        break;
      default:
        break;
    }
  }

  const handleDetermineMove = (index, stride) => {
    const speed    = playerContext.speed,
          willMove = playerContext.willMove,
          canMove  = playerContext.canMove;
    if (index === 0 && stride > 0 && canMove.right) {  //right
      clearInterval(willMove.right);
      clearInterval(willMove.left);
      handlePlayerMove(index, stride);
      willMove.right = setInterval(() => handlePlayerMove(index, stride), speed);
      willMove.left  = false;
      canMove.right  = false;
    }
    if (index === 0 && stride < 0 && canMove.left) {  //left
      clearInterval(willMove.left);
      clearInterval(willMove.right);
      handlePlayerMove(index, stride);
      willMove.left  = setInterval(() => handlePlayerMove(index, stride), speed);
      willMove.right = false;
      canMove.left   = false;
    }
    if (index === 1 && stride > 0 && canMove.down) {  //down
      clearInterval(willMove.down);
      clearInterval(willMove.up);
      handlePlayerMove(index, stride);
      willMove.down = setInterval(() => handlePlayerMove(index, stride), speed);
      willMove.up   = false;
      canMove.down  = false;
    }
    if (index === 1 && stride < 0 && canMove.up) {  //up
      clearInterval(willMove.up);
      clearInterval(willMove.down);
      handlePlayerMove(index, stride);
      willMove.up   = setInterval(() => handlePlayerMove(index, stride), speed);
      willMove.down = false;
      canMove.up    = false;
    }
  }

   //removes the interval set to a key to stop movement and allows the key input to register again.  Also handles opposing directions.
  const handleKeyUp = e => {
    e.preventDefault();
    const stride   = playerContext.stride,
          willMove = playerContext.willMove,
          canMove  = playerContext.canMove;
    switch(e.key) {
      case 'ArrowRight':
      case 'd':
        clearInterval(willMove.right);
        canMove.right  = true;
        willMove.right = false;
        if (!canMove.left) {
          canMove.left = true;
          handleDetermineMove(0, -stride);
        }
        break
      case 'ArrowLeft':
      case 'a':
        clearInterval(willMove.left);
        canMove.left  = true;
        willMove.left = false;
        if (!canMove.right) {
          canMove.right = true;
          handleDetermineMove(0, stride);
        }
        break;
      case 'ArrowDown':
      case 's':
        clearInterval(willMove.down);
        canMove.down  = true;
        willMove.down = false;
        if (!canMove.up) {
          canMove.up = true;
          handleDetermineMove(1, -stride);
        }
        break;
      case 'ArrowUp':
      case 'w':
        clearInterval(willMove.up);
        canMove.up  = true;
        willMove.up = false;
        if (!canMove.down) {
          canMove.down = true;
          handleDetermineMove(1, stride);
        }
        break;
      default:
        break;
    }
  }

  const handleClearMovement = () => {
    const willMove = playerContext.willMove;
    clearInterval(willMove.right);
    clearInterval(willMove.left);
    clearInterval(willMove.up);
    clearInterval(willMove.down);
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