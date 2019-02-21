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
      right: true,
      left: true,
      down: true,
      up: true
    },
    isReady: true,
    size: 15,
    speed: 10, // larger is slower, 10 is the fastest.
    stride: 4, // how far the player moves with each move input. Also affects the movement speed.
    willMove: {
      right: false,
      left: false,
      down: false,
      up: false
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

      if (health > 0) this.setState(prevState => ({ health: prevState.health - damage }));
    },
    clearMovementIntervals: (direction) => {
      switch(direction) {
        case 'right':
          clearInterval(this.data.willMove.right);
          this.data.willMove.right = false;
          break;
        case 'left':
          clearInterval(this.data.willMove.left);
          this.data.willMove.left = false;
          break;
        case 'down':
          clearInterval(this.data.willMove.down);
          this.data.willMove.down = false;
          break;
        case 'up':
          clearInterval(this.data.willMove.up);
          this.data.willMove.up = false;
          break;
        default:
          break;
      }
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