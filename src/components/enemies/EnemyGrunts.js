import React, { Component } from 'react';
import { gameData } from '../../data/game/gameData';
import { grunt } from '../../data/enemies/grunt';
import Enemy from './EnemyGrunt';

class Enemies extends Component {
  grunts;
  interval;
  numberEnemies = 20;
  stage = 0;

  handlePopulateEnemies = () => {
    if (grunt.pos.length <= 0) return;

    this.grunts = grunt.pos.map((item, index) => {
      return (
        <Enemy
          playerTakeDamage={this.props.handleTakeDamage}
          playerPos={this.props.playerPos}
          playerSize={this.props.playerSize}
          index={index}
          isShooting={this.props.isShooting}
          crosshairPos={this.props.crosshairPos}
          key={grunt.keys[index]}
        />
      )
    });
  }

  handleGameState= () => {
    if (grunt.pos.length <= 0) {
      this.numberEnemies += 3;
      this.stage += 1;
      grunt.generateGrunts(this.numberEnemies);
    }
    this.handlePopulateEnemies();
  }

  shouldComponentUpdate() { return false }

  componentDidMount() {
    setTimeout(() => this.interval = setInterval(() => this.forceUpdate(), gameData.frameRate), 1000);
  }
  
  componentWillUpdate() { this.handleGameState() }

  componentWillUnmount() { clearInterval(this.interval) }

  render() {
    return (
      <div className='tempHud'>
        <div>
          {this.grunts}
        </div>
        <div className='stageCounter'>
          Stage: {this.stage}
        </div>
      </div>
    )
  }
}

export default Enemies;