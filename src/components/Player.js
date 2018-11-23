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
    const size = this.props.size;
    const width = this.map.width;
    const height = this.map.height;
    if (newPlayerPos[0] < 0) {
      newPlayerPos.splice(0, 1, 0);
    }
    if (newPlayerPos[0] > width - (size * 2)) {
      newPlayerPos.splice(0, 1, width - (size * 2));
    }
    if (newPlayerPos[1] < 0) {
      newPlayerPos.splice(1, 1, 0);
    }
    if (newPlayerPos[1] > height - (size * 2)) {
      newPlayerPos.splice(1, 1, height - (size * 2))
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
    else if (willMove.left && willMove.up) {
      newPlayerPos.splice(0, 1, newPlayerPos[0] - stride/2);
      newPlayerPos.splice(1, 1, newPlayerPos[1] - stride/2);
    }
    else if (willMove.right && willMove.down) {
      newPlayerPos.splice(0, 1, newPlayerPos[0] + stride/2);
      newPlayerPos.splice(1, 1, newPlayerPos[1] + stride/2);
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

  handleKeydown = (e) => {
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
    if (index === 0 && stride > 0 && canMove.right) {
      clearInterval(willMove.left);
      clearInterval(willMove.right);
      willMove.right = (
        setInterval(() => {this.handlePlayerMove(index, stride)}, speed)
      );
      canMove.right = false;
    }
    if (index === 0 && stride < 0 && canMove.left) {
      clearInterval(willMove.right);
      clearInterval(willMove.left);
      willMove.left = (
        setInterval(() => {this.handlePlayerMove(index, stride)}, speed)
      );
      canMove.left = false;
    }
    if (index === 1 && stride > 0 && canMove.down) {
      clearInterval(willMove.up);
      clearInterval(willMove.down);
      willMove.down = (
        setInterval(() => {this.handlePlayerMove(index, stride)}, speed)
      );
      canMove.down = false;
    }
    if (index === 1 && stride < 0 && canMove.up) {
      clearInterval(willMove.down);
      clearInterval(willMove.up);
      willMove.up = (
        setInterval(() => {this.handlePlayerMove(index, stride)}, speed)
      );
      canMove.up = false;
    }
  }

   //removes the interval set to a key to stop movement and allows the key input to register again.
  handleKeyup = (e) => {
    e.preventDefault();
    const stride = this.props.stride;
    switch(e.key) {
      case 'ArrowRight':
      case 'd':
        this.props.canMove.right = true;
        clearInterval(this.props.willMove.right);
        this.props.willMove.right = false;
        if (!this.props.canMove.left) {
          this.props.canMove.left = true;
          this.handleDetermineMove(0, -stride);
        }
        break
      case 'ArrowLeft':
      case 'a':
        this.props.canMove.left = true;
        clearInterval(this.props.willMove.left);
        this.props.willMove.left = false;
        if (!this.props.canMove.right) {
          this.props.canMove.right = true;
          this.handleDetermineMove(0, stride);
        }
        break;
      case 'ArrowDown':
      case 's':
        this.props.canMove.down = true;
        clearInterval(this.props.willMove.down);
        this.props.willMove.down = false;
        if (!this.props.canMove.up) {
          this.props.canMove.up = true;
          this.handleDetermineMove(1, -stride);
        }
        break;
      case 'ArrowUp':
      case 'w':
        this.props.canMove.up = true;
        clearInterval(this.props.willMove.up);
        this.props.willMove.up = false;
        if (!this.props.canMove.down) {
          this.props.canMove.down = true;
          this.handleDetermineMove(1, stride);
        }
        break;
      default:
        break;
    }
  }

  handleClearMovement = () => {
    clearInterval(this.props.willMove.right);
    this.props.willMove.right = false;
    clearInterval(this.props.willMove.left);
    this.props.willMove.left = false;
    clearInterval(this.props.willMove.up);
    this.props.willMove.up = false;
    clearInterval(this.props.willMove.down);
    this.props.willMove.down = false;
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('keyup', this.handleKeyup);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
    document.removeEventListener('keyup', this.handleKeyup);
  }

  render() {

    const { playerPos, size } = this.props;

    return (
      <>
        <div              
          className='player'
          style={{
            background: 'black',
            padding: size,
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