import React, { Component } from 'react';
import { enemyData } from '../helpers/enemies';
import Enemy from './Enemy';

class Enemies extends Component {
  enemies;
  stage = 15;

  handlePopulateEnemies = () => {
    if (enemyData.enemiesPos.length <= 0) {

      return;
    }
    this.enemies = enemyData.enemiesPos.map((item, index) => {
      return (
        <Enemy
          playerTakeDamage={this.props.handleTakeDamage}
          playerPos={this.props.playerPos}
          playerSize={this.props.playerSize}
          index={index}
          key={enemyData.enemyKeys[index]}
        />
      )
    });
  }

  handleGameState= () => {
    if (enemyData.enemiesPos.length <= 0) {
      this.stage += 1;
      enemyData.generateEnemies(this.stage)
    }
    this.handlePopulateEnemies();
  }

  interval;

  shouldComponentUpdate() {

    return false;
  }

  componentDidMount() {
    setTimeout(() => this.interval = setInterval(() => this.forceUpdate(), 32), 1000)
  }
  
  componentWillUpdate() {
    this.handleGameState();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        {this.enemies}
      </div>
    )
  }
}

export default Enemies;