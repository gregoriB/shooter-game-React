import React, { Component } from 'react'
import { GameContext } from '../contexts/GameContext'
import Player from './Player';

export default class Arena extends Component {
  render() {
    return (
      <div className='arena'>
          <GameContext.Consumer>
          {(context) => (
            <>
              <Player {...context} />
            </>
          )}
        </GameContext.Consumer>
      </div>
    )
  }
}
