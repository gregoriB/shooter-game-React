import React, { Component } from 'react';

export const PlayerContext = React.createContext();

export class PlayerProvider extends Component {
  state = {
    playerPos: [450, 300],
    playerHealth: 100
  }

  player = {
    canMove: {
      left: true,
      right: true,
      up: true,
      down: true
    },
    isReady: true,
    playerSize: 15,
    speed: 10, // larger is slower, 10 is the fastest.
    stride: 4, // how far the player moves with each move input. Also affects the movement speed.
    willMove: {
      left: false,
      right: false,
      up: false,
      down: false
    }
  }

  functions = {
    handlePlayerMove: (newPlayerPos) => {
      this.setState(() => ({ playerPos: newPlayerPos }));
    },

    handleTakeDamage: (damage) => {
      const health = this.state.playerHealth;
      this.setState(() => ({ playerHealth: health - damage }));
    }
  }

  render() {
    return (
      <PlayerContext.Provider 
        value={{
          ...this.state,
          ...this.functions,
          ...this.player
        }}
      >
        {this.props.children}
      </PlayerContext.Provider>
    );
  }
}