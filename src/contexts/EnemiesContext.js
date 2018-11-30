import React, { Component } from 'react';
import uuid from 'uuid';

export const EnemyContext = React.createContext();

export class EnemyProvider extends Component {
  
  enemies = {
    enemySize: 10,
    enemiesPos: [],
    enemyColors: [],
    enemySpeed: [],
    enemyKeys: [],
    generateEnemies: (num) => {
      const nme = this.enemies;
      for (let i = 0; i < num; i++) {
        const X = Math.random() < .5 ? 0 : 900 - nme.enemySize*2;
        const Y = ~~(Math.random()*(600 - nme.enemySize*2));
        const color = `rgb(${~~(Math.random()*105)+150}, ${~~(Math.random()*80)}, ${~~(Math.random()*32)}`;
        const speed = 10 + ~~(Math.random()*50);
        const key = uuid();
        nme.enemiesPos.push([X, Y]);
        nme.enemyColors.push(color);
        nme.enemySpeed.push(speed)
        nme.enemyKeys.push(key);
      }
    },
    updateEnemyPos: (index, newPos) => {
      this.enemies.enemiesPos.splice(index, 1, newPos)
    },
    removeEnemy: (index) => {
      const nme = this.enemies
      nme.enemiesPos.splice(index, 1)
      nme.enemyKeys.splice(index, 1)
      nme.enemyColors.splice(index, 1)
      nme.enemySpeed.splice(index, 1)
    }
  }

  render() {
    return (
      <EnemyContext.Provider 
        value={{
          ...this.enemies
        }}
      >
        {this.props.children}
      </EnemyContext.Provider>
    );
  }
}