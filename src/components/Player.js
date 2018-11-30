import React, { Component } from 'react';

class Player extends Component {

  map = {
    height: 600,
    width: 900
  }

  handlePlayerMove = (index, speed) => {
    let newPlayerPos = this.handleDiagonalMovements([...this.props.playerPos], index, speed);
    this.handleBoundaryCheck(newPlayerPos);
    this.props.handlePlayerMove(newPlayerPos);
  }

  handleBoundaryCheck = (newPlayerPos) => {
    const playerSize = this.props.playerSize;
    const width = this.map.width;
    const height = this.map.height;
    if (newPlayerPos[0] < 0) {
      newPlayerPos.splice(0, 1, 0);
    }
    if (newPlayerPos[0] > width - (playerSize * 2)) {
      newPlayerPos.splice(0, 1, width - (playerSize * 2));
    }
    if (newPlayerPos[1] < 0) {
      newPlayerPos.splice(1, 1, 0);
    }
    if (newPlayerPos[1] > height - (playerSize * 2)) {
      newPlayerPos.splice(1, 1, height - (playerSize * 2))
    }
  }

  handleDiagonalMovements = (playerPos, index, speed) => {
    let newPlayerPos = playerPos;
    const willMove = this.props.willMove;
    const stride = this.props.stride;
    if (willMove.right && willMove.up) {
      newPlayerPos.splice(0, 1, newPlayerPos[0] + stride/2);
      newPlayerPos.splice(1, 1, newPlayerPos[1] - stride/2);
    }
    else if (willMove.right && willMove.down) {
      newPlayerPos.splice(0, 1, newPlayerPos[0] + stride/2);
      newPlayerPos.splice(1, 1, newPlayerPos[1] + stride/2);
    }
    else if (willMove.left && willMove.up) {
      newPlayerPos.splice(0, 1, newPlayerPos[0] - stride/2);
      newPlayerPos.splice(1, 1, newPlayerPos[1] - stride/2);
    }
    else if (willMove.left && willMove.down) {
      newPlayerPos.splice(0, 1, newPlayerPos[0] - stride/2);
      newPlayerPos.splice(1, 1, newPlayerPos[1] + stride/2);
    } 
    else {
      newPlayerPos.splice(index, 1, newPlayerPos[index] + speed);
    }
    
    return newPlayerPos;
  }

  handleKeyDown = (e) => {
    e.preventDefault();
    if (!this.props.isReady) {
      this.handleClearMovement();

      return;
    }
    this.handleDirections(e);
  }

   // using intervals for continous movement as a workaround to avoid key repeat from the operating system.
   // only the first keypress is registered and the interval continues until the key registers a 'keyup'.
  handleDirections = (e) => {
    e.preventDefault();
    const stride = this.props.stride;
    switch(e.key) {
      case 'ArrowRight':
      case 'd':
        this.handleDetermineMove(0, stride);
        break;
      case 'ArrowLeft':
      case 'a':
        this.handleDetermineMove(0, -stride);
        break;
      case 'ArrowDown':
      case 's':
        this.handleDetermineMove(1, stride);
        break;
      case 'ArrowUp':
      case 'w':
        this.handleDetermineMove(1, -stride);
        break;
      default:
        break;
    }
  }

  handleDetermineMove = (index, stride) => {
    const speed = this.props.speed;
    const willMove = this.props.willMove;
    const canMove = this.props.canMove;
    if (index === 0 && stride > 0 && canMove.right) {  //right
      clearInterval(willMove.right);
      willMove.right = (
        setInterval(() => {this.handlePlayerMove(index, stride)}, speed)
      );
      clearInterval(willMove.left);
      willMove.left = false;
      canMove.right = false;
    }
    if (index === 0 && stride < 0 && canMove.left) {  //left
      clearInterval(willMove.left);
      willMove.left = (
        setInterval(() => {this.handlePlayerMove(index, stride)}, speed)
      );
      clearInterval(willMove.right);
      willMove.right = false;
      canMove.left = false;
    }
    if (index === 1 && stride > 0 && canMove.down) {  //down
      clearInterval(willMove.down);
      willMove.down = (
        setInterval(() => {this.handlePlayerMove(index, stride)}, speed)
      );
      clearInterval(willMove.up);
      willMove.up = false;
      canMove.down = false;
    }
    if (index === 1 && stride < 0 && canMove.up) {  //up
      clearInterval(willMove.up);
      willMove.up = (
        setInterval(() => {this.handlePlayerMove(index, stride)}, speed)
      );
      clearInterval(willMove.down);
      willMove.down = false;
      canMove.up = false;
    }
  }

   //removes the interval set to a key to stop movement and allows the key input to register again.  Also handles opposing directions.
  handleKeyUp = (e) => {
    e.preventDefault();
    const stride = this.props.stride;
    const willMove = this.props.willMove;
    const canMove = this.props.canMove;
    switch(e.key) {
      case 'ArrowRight':
      case 'd':
        clearInterval(willMove.right);
        canMove.right = true;
        willMove.right = false;
        if (!canMove.left) {
          canMove.left = true;
          this.handleDetermineMove(0, -stride);
        }
        break
      case 'ArrowLeft':
      case 'a':
        clearInterval(willMove.left);
        canMove.left = true;
        willMove.left = false;
        if (!canMove.right) {
          canMove.right = true;
          this.handleDetermineMove(0, stride);
        }
        break;
      case 'ArrowDown':
      case 's':
        clearInterval(willMove.down);
        canMove.down = true;
        willMove.down = false;
        if (!canMove.up) {
          canMove.up = true;
          this.handleDetermineMove(1, -stride);
        }
        break;
      case 'ArrowUp':
      case 'w':
        clearInterval(willMove.up);
        canMove.up = true;
        willMove.up = false;
        if (!canMove.down) {
          canMove.down = true;
          this.handleDetermineMove(1, stride);
        }
        break;
      default:
        break;
    }
  }

  handleClearMovement = () => {
    const willMove = this.props.willMove;
    clearInterval(willMove.right);
    willMove.right = false;
    clearInterval(willMove.left);
    willMove.left = false;
    clearInterval(willMove.up);
    willMove.up = false;
    clearInterval(willMove.down);
    willMove.down = false;
  }

  shouldComponentUpdate() {

    return false;
  }

  interval;

  componentDidMount() {
    this.interval = setInterval(() => this.forceUpdate(), 16);
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  render() {

    const { playerPos, playerSize } = this.props;
    
    return (
      <>
        <div              
          className='player'
          style={{
            color: 'white',
            background: 'black',
            padding: playerSize,
            position: 'absolute',
            left: playerPos[0],
            top: playerPos[1]
          }}
        />
      </>
    )
  }
}

export default Player;