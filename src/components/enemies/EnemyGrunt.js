import React, { Component } from 'react';
import { audio } from '../../data/audio/audio';
import { gameData } from '../../data/game/gameData';
import { grunt } from '../../data/enemies/grunt';

class Enemy extends Component {
  movementInterval = false;
  damageInterval = false;
  key = grunt.keys[this.props.index];

  handleEnemyMovement = () => {
    const index = this.props.index;
    if (!grunt.keys[index]) return;

    let gruntX = grunt.pos[index][0],
        gruntY = grunt.pos[index][1];
    const move    = ~~(Math.random() * 5),
          playerX = this.props.playerPos[0],
          playerY = this.props.playerPos[1];
    gruntX = gruntX > playerX ? gruntX - move: gruntX + move;
    gruntY = gruntY > playerY ? gruntY - move: gruntY + move;
    grunt.updateGruntPos(index, [gruntX, gruntY]);
    this.handleCheckPlayerCollision(gruntX, gruntY, playerX, playerY);
    this.handleCheckCrosshairPos(gruntX, gruntY, playerX, playerY);
  }

  handleCheckPlayerCollision = (gruntX, gruntY, playerX, playerY) => {
    const gruntSize  = grunt.size * 2,
          playerSize = this.props.playerSize * 2;
    if (((gruntX <= playerX && gruntX + gruntSize >= playerX) ||
        ( gruntX + gruntSize >= playerX + playerSize && gruntX <= playerX + playerSize) ||
        ( gruntX >= playerX && gruntX + gruntSize <= playerX + playerSize))
          &&
        ((gruntY <= playerY && gruntY + gruntSize >= playerY) ||
        ( gruntY + gruntSize >= playerY + playerSize && gruntY <= playerY + playerSize) ||
        ( gruntY >= playerY && gruntY + gruntSize <= playerY + playerSize ))) {
          if (!this.damageInterval) {
            this.damageInterval = setInterval(() => this.props.playerTakeDamage(grunt.damage), 1000);
            this.props.playerTakeDamage(grunt.damage);
          }
    } 
    else {
      clearInterval(this.damageInterval);
      this.damageInterval = false;
    }
  }
  
  handleCheckCrosshairPos = (gruntX, gruntY) => {
    if (!gameData.isShooting) return;

    const crosshairX = this.props.crosshairPos[0],
          crosshairY = this.props.crosshairPos[1],
          gruntSize  = grunt.size * 2;
    if ((crosshairX >= gruntX && crosshairX <= gruntX + gruntSize) && (crosshairY >= gruntY && crosshairY <= gruntY + gruntSize)) {
      this.handleDamageGrunt();
      gameData.isShooting = false;
    }
  }

  handleDamageGrunt = () => {
    if (this.key === grunt.keys[this.props.index] ) {
      audio.hit1.volume = .1;
      audio.hit1.currentTime = 0;
      audio.hit1.play();
      clearInterval(this.movementInterval);
      this.movementInterval = false;
      grunt.removeGrunt(this.props.index);
    }
  }

  componentDidMount() {
    this.movementInterval = setInterval(() => this.handleEnemyMovement(), grunt.speed[this.props.index]);
  }

  componentWillUnmount() {
    clearInterval(this.movementInterval);
    clearInterval(this.damageInterval);
    this.movementInterval = false;
    this.damageInterval = false;  
  }

  render() {
    const { index } = this.props;

    return (
      <div
        className='enemy'
        style={{
          background: grunt.color[index],
          left: grunt.pos[this.props.index][0],
          top: grunt.pos[this.props.index][1],
          padding: grunt.size,
        }}
      />
    )
  }
}

export default Enemy;