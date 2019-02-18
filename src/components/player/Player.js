import React, { useContext, useEffect } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
// import { gameData } from '../../data/game/gameData';

export default function Player() {
  const context = useContext(PlayerContext);
  let map = { height: 600, width: 900 };
  const handlePlayerMove = (index, speed) => {
    let newPlayerPos = handleDiagonalMovements(index, speed);
    handleBoundaryCheck(newPlayerPos);
    context.playerFunctions.playerMove(newPlayerPos);
  }

  const handleBoundaryCheck = newPlayerPos => {
    const playerSize = context.playerData.size * 2,
          width      = map.width,
          height     = map.height;
    if (newPlayerPos[0] < 0) newPlayerPos.splice(0, 1, 0);
    if (newPlayerPos[1] < 0) newPlayerPos.splice(1, 1, 0);
    if (newPlayerPos[0] > width - playerSize) newPlayerPos.splice(0, 1, width - playerSize);
    if (newPlayerPos[1] > height - playerSize) newPlayerPos.splice(1, 1, height - playerSize);
  }

  const handleDiagonalMovements = (index, speed) => {
    let playerPos = [...context.playerPos];
    // console.log(playerPos)
    const willMove = context.playerData.willMove,
          stride   = context.playerData.stride;
    if (willMove.right && willMove.up) {
      playerPos.splice(0, 1, playerPos[0] + stride/2);
      playerPos.splice(1, 1, playerPos[1] - stride/2);
    }
    else if (willMove.right && willMove.down) {
      playerPos.splice(0, 1, playerPos[0] + stride/2);
      playerPos.splice(1, 1, playerPos[1] + stride/2);
    }
    else if (willMove.left && willMove.up) {
      playerPos.splice(0, 1, playerPos[0] - stride/2);
      playerPos.splice(1, 1, playerPos[1] - stride/2);
    }
    else if (willMove.left && willMove.down) {
      playerPos.splice(0, 1, playerPos[0] - stride/2);
      playerPos.splice(1, 1, playerPos[1] + stride/2);
    } 
    else playerPos.splice(index, 1, playerPos[index] + speed);
    
    return playerPos;
  }

  const handleKeyDown = e => {
    e.preventDefault();
    if (!context.playerData.isReady) return handleClearMovement();

    handleDirections(e);
  }

   // using intervals for continous movement as a workaround to avoid key repeat from the operating system.
   // only the first keypress is registered and the interval continues until the key registers a 'keyup'.
   const handleDirections = e => {
    e.preventDefault();
    const stride = context.playerData.stride;
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
    const speed    = context.playerData.speed,
          willMove = context.playerData.willMove,
          canMove  = context.playerData.canMove;
    if (index === 0 && stride > 0 && canMove.right) {  //right
      clearInterval(willMove.right);
      clearInterval(willMove.left);
      willMove.right = setInterval(() => handlePlayerMove(index, stride), speed);
      willMove.left = false;
      canMove.right = false;
    }
    if (index === 0 && stride < 0 && canMove.left) {  //left
      clearInterval(willMove.left);
      clearInterval(willMove.right);
      willMove.left = setInterval(() => handlePlayerMove(index, stride), speed);
      willMove.right = false;
      canMove.left = false;
    }
    if (index === 1 && stride > 0 && canMove.down) {  //down
      clearInterval(willMove.down);
      clearInterval(willMove.up);
      willMove.down = setInterval(() => handlePlayerMove(index, stride), speed);
      willMove.up = false;
      canMove.down = false;
    }
    if (index === 1 && stride < 0 && canMove.up) {  //up
      clearInterval(willMove.up);
      clearInterval(willMove.down);
      willMove.up = setInterval(() => handlePlayerMove(index, stride), speed);
      willMove.down = false;
      canMove.up = false;
    }
  }

   //removes the interval set to a key to stop movement and allows the key input to register again.  Also handles opposing directions.
  const handleKeyUp = e => {
    e.preventDefault();
    const stride   = context.playerData.stride,
          willMove = context.playerData.willMove,
          canMove  = context.playerData.canMove;
    switch(e.key) {
      case 'ArrowRight':
      case 'd':
        clearInterval(willMove.right);
        canMove.right = true;
        willMove.right = false;
        if (!canMove.left) {
          canMove.left = true;
          handleDetermineMove(0, -stride);
        }
        break
      case 'ArrowLeft':
      case 'a':
        clearInterval(willMove.left);
        canMove.left = true;
        willMove.left = false;
        if (!canMove.right) {
          canMove.right = true;
          handleDetermineMove(0, stride);
        }
        break;
      case 'ArrowDown':
      case 's':
        clearInterval(willMove.down);
        canMove.down = true;
        willMove.down = false;
        if (!canMove.up) {
          canMove.up = true;
          handleDetermineMove(1, -stride);
        }
        break;
      case 'ArrowUp':
      case 'w':
        clearInterval(willMove.up);
        console.log(canMove, willMove)
        canMove.up = true;
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
    const willMove = context.playerData.willMove;
    clearInterval(willMove.right);
    clearInterval(willMove.left);
    clearInterval(willMove.up);
    clearInterval(willMove.down);
    willMove.right = false;
    willMove.left = false;
    willMove.up = false;
    willMove.down = false;
  }

  // shouldComponentUpdate() { return false }

  useEffect(() => {
    // this.interval = setInterval(() => this.forceUpdate(), gameData.frameRate);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    }
  })

  return (
    <>
      <div              
        className='player'
        style={{
          color: 'white',
          background: 'black',
          padding: context.playerData.size,
          position: 'absolute',
          left: context.playerPos[0],
          top: context.playerPos[1]
        }}
      />
    </>
  )

}