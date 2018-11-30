import React, { Component } from 'react'
import { enemyData } from '../helpers/enemies';

class Enemy extends Component {

  movementInterval;
  damageInterval = false;

  handleEnemyMovement = () => {
    const index = this.props.index;
    if (!enemyData.enemiesPos[index]) {

      return;
    }
    let enemyX = enemyData.enemiesPos[index][0];
    let enemyY = enemyData.enemiesPos[index][1];
    const enemySize = enemyData.enemySize*2;
    const playerX = this.props.playerPos[0];
    const playerY = this.props.playerPos[1];
    const playerSize = this.props.playerSize * 2;
    if (enemyX + enemySize < playerX + playerSize) {
      enemyX += ~~(Math.random() * 5);
    }
    if (enemyX > playerX) {
      enemyX -= ~~(Math.random() * 5);
    }
    if (enemyY + enemySize < playerY + playerSize) {
      enemyY += ~~(Math.random() * 5);
    }
    if (enemyY > playerY) {
      enemyY -= ~~(Math.random() * 5);
    }
    this.handleCheckPlayerCollision(enemyX, enemyY, playerX, playerY);
    enemyData.updateEnemyPos(index, [enemyX, enemyY]);
  }

  handleCheckPlayerCollision = (enemyX, enemyY, playerX, playerY) => {
    const enemySize = enemyData.enemySize*2
    const playerSize = this.props.playerSize*2;
    if (((enemyX <= playerX && enemyX + enemySize >= playerX) ||
        ( enemyX + enemySize >= playerX + playerSize && enemyX <= playerX + playerSize) ||
        ( enemyX >= playerX && enemyX + enemySize <= playerX + playerSize))
          &&
        ((enemyY <= playerY && enemyY + enemySize >= playerY) ||
        ( enemyY + enemySize >= playerY + playerSize && enemyY <= playerY + playerSize) ||
        ( enemyY >= playerY && enemyY + enemySize <= playerY + playerSize ))) {
          if (!this.damageInterval) {
            this.damageInterval = setInterval(() => this.props.playerTakeDamage(10), 1000);
            this.props.playerTakeDamage(10)
          }
    } 
    else {
      clearInterval(this.damageInterval)
      this.damageInterval = false;
    }
  }

  handleClicked = () => {
    clearInterval(this.movementInterval)
    enemyData.removeEnemy(this.props.index);
  }

  componentDidMount() {
    this.movementInterval = setInterval(() => this.handleEnemyMovement(), enemyData.enemySpeed[this.props.index])
  }

  componentWillUnmount() {
    clearInterval(this.movementInterval)
    clearInterval(this.damageInterval)

  }

  render() {

    const { index } = this.props;

    return (
      <div
        className='enemy'
        onMouseDown={this.handleClicked}
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