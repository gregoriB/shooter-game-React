import React, { Component } from 'react';

export const GameContext = React.createContext();

export class GameProvider extends Component {
  state = {
    playerPos: [450, 300]
  }

  player = {
    canMove: {
      left: true,
      right: true,
      up: true,
      down: true
    },
    isReady: true,
    size: 12,
    speed: 10, // larger is slower, 10 is the fastest.
    stride: 4, // how far the player moves with each move input. Also affects the movement speed.
    willMove: {
      left: '',
      right: '',
      up: '',
      down: ''
    }
  }

  functions = {
    handlePlayerMove: (newPlayerPos) => {
      this.setState(() => ({ playerPos: newPlayerPos }));
    }
  }

  render() {
    return (
      <GameContext.Provider 
        value={{
          ...this.state,
          ...this.functions,
          ...this.player
        }}
      >
        {this.props.children}
      </GameContext.Provider>
    );
  }
}