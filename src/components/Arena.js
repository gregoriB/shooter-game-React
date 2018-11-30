import React, { Component } from 'react'
import { PlayerContext } from '../contexts/PlayerContext';
import { EnemyContext } from '../contexts/EnemiesContext';
import Player from './Player';
import Enemies from './Enemies';
import Hud from './Hud';
import Crosshairs from './Crosshairs';

export default class Arena extends Component {
  render() {
    return (
      <div className='arena'
      >
        <EnemyContext.Consumer>
          {enemies => (
            <PlayerContext.Consumer>
              {player => (
                <>
                  <Hud {...player} />
                  <Player {...player} />
                  <Enemies {...enemies} {...player} />
                  <Crosshairs />
                </>
              )}
            </PlayerContext.Consumer>
          )}
        </EnemyContext.Consumer>
      </div>
    )
  }
}
