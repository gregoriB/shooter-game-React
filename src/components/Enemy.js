import React, { Component } from 'react'
import { enemyData } from '../helpers/enemies';
import { audio } from '../helpers/audio'

class Enemy extends Component {

  movementInterval;
  damageInterval = false;

  handleEnemyMovement = () => {
    const index = this.props.index;
    if (!enemyData.enemyKeys[index]) {

      return;
    }
    let move = ~~(Math.random() * 5);
    let enemyX = enemyData.enemiesPos[index][0];
    let enemyY = enemyData.enemiesPos[index][1];
    const enemySize = enemyData.enemySize*2;
    const playerX = this.props.playerPos[0];
    const playerY = this.props.playerPos[1];
    const playerSize = this.props.playerSize * 2;
    // if (enemyX + enemySize < playerX + playerSize) {
    //   enemyX += ~~(Math.random() * 5);
    // }
    // if (enemyX > playerX) {
    //   enemyX -= ~~(Math.random() * 5);
    // }
    // if (enemyY + enemySize < playerY + playerSize) {
    //   enemyY += ~~(Math.random() * 5);
    // }
    // if (enemyY > playerY) {
    //   enemyY -= ~~(Math.random() * 5);
    // }

    enemyX = enemyX > playerX ? enemyX - move: enemyX + move;
    enemyY = enemyY > playerY ? enemyY - move: enemyY + move;

    this.handleCheckPlayerCollision(enemyX, enemyY, playerX, playerY);
    enemyData.updateEnemyPos(index, [enemyX, enemyY]);
    this.handleCheckCrosshairPos();
  }

  handleCheckPlayerCollision = (enemyX, enemyY, playerX, playerY) => {
    const enemySize = enemyData.enemySize*2;
    const playerSize = this.props.playerSize*2;
    if (((enemyX <= playerX && enemyX + enemySize >= playerX) ||
        ( enemyX + enemySize >= playerX + playerSize && enemyX <= playerX + playerSize) ||
        ( enemyX >= playerX && enemyX + enemySize <= playerX + playerSize))
          &&
        ((enemyY <= playerY && enemyY + enemySize >= playerY) ||
        ( enemyY + enemySize >= playerY + playerSize && enemyY <= playerY + playerSize) ||
        ( enemyY >= playerY && enemyY + enemySize <= playerY + playerSize ))) {
          if (!this.damageInterval) {
            this.damageInterval = setInterval(() => this.props.playerTakeDamage(enemyData.enemyDamage), 1000);
            this.props.playerTakeDamage(enemyData.enemyDamage);
          }
    } 
    else {
      clearInterval(this.damageInterval);
      this.damageInterval = false;
    }
  }

  handleClicked = () => {
    audio.hit1.volume = .1;
    audio.hit1.currentTime = 0;
    audio.hit1.play();
    clearInterval(this.movementInterval);
    enemyData.removeEnemy(this.props.index);
  }

  handleCheckCrosshairPos = () => {
    const index = this.props.index;
    if (!this.props.firing) {

      return;
    }
    const crosshairX = this.props.crosshairPos[0];
    const crosshairY = this.props.crosshairPos[1];
    const enemyX = enemyData.enemiesPos[index][0];
    const enemyY = enemyData.enemiesPos[index][1];
    const enemySize = enemyData.enemySize*2;
    if ((crosshairX >= enemyX && crosshairX <= enemyX + enemySize) && (crosshairY >= enemyY && crosshairY <= enemyY + enemySize)) {
      this.handleClicked();
    }
  }

  componentDidMount() {
    this.movementInterval = setInterval(() => this.handleEnemyMovement(), enemyData.enemySpeed[this.props.index]);
  }

  componentWillUnmount() {
    clearInterval(this.movementInterval);
    clearInterval(this.damageInterval);
  }

  render() {

    const { index } = this.props;

    return (
      <div
        className='enemy'
        // onMouseDown={this.handleClicked}
        style={{
          background: enemyData.enemyColors[index],
          left: enemyData.enemiesPos[this.props.index][0],
          top: enemyData.enemiesPos[this.props.index][1],
          padding: enemyData.enemySize,
        }}
      />
    )
  }
}

export default Enemy;