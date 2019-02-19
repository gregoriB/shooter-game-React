import React, { Component } from 'react';
import { audio } from '../data/audio/audio'

export const PlayerContext = React.createContext();  

export class PlayerProvider extends Component {
  state = {
    pos: [450, 300],
    health: 100
  }

  data = {
    canMove: {
      left: true,
      right: true,
      up: true,
      down: true
    },
    isReady: true,
    size: 15,
    speed: 100, // larger is slower, 10 is the fastest.
    stride: 4, // how far the player moves with each move input. Also affects the movement speed.
    willMove: {
      left: false,
      right: false,
      up: false,
      down: false
    }
  }

  functions = {
    playerMove: newPos => {
      this.setState({ pos: newPos });
    },

    takeDamage: damage => {
      const health = this.state.health;
      audio.hit2.volume = .1;
      audio.hit2.currentTime = 0;
      audio.hit2.play();
      if (!health || health - damage <= 0) return this.setState({ health: 'DEAD' });

      if (health > 0) this.setState({ health: health - damage });
    }
  }

  render() {
    return (
      <PlayerContext.Provider 
        value={{
          ...this.state,
          ...this.functions,
          ...this.data
        }}
      >
        {this.props.children}
      </PlayerContext.Provider>
    );
  }
}