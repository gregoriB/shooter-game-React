
import uuid from 'uuid';

export const enemyData = {
    enemySize: 12,
    enemiesPos: [],
    enemyColors: [],
    enemySpeed: [],
    enemyKeys: [],
    enemyDamage: 10,
    generateEnemies: (num) => {
      for (let i = 0; i < num; i++) {
        const X = Math.random() < .5 ? 0 : 900 - enemyData.enemySize*2;
        const Y = ~~(Math.random()*(600 - enemyData.enemySize*2));
        const color = `rgb(${~~(Math.random()*105)+150}, ${~~(Math.random()*80)}, ${~~(Math.random()*32)}`;
        const speed = 7 + ~~(Math.random()*50);
        const key = uuid();
        enemyData.enemiesPos.push([X, Y]);
        enemyData.enemyColors.push(color);
        enemyData.enemySpeed.push(speed)
        enemyData.enemyKeys.push(key);
      }
    },
    updateEnemyPos: (index, newPos) => {
      enemyData.enemiesPos.splice(index, 1, newPos)
    },
    removeEnemy: (index) => {
      enemyData.enemiesPos.splice(index, 1)
      enemyData.enemyKeys.splice(index, 1)
      enemyData.enemyColors.splice(index, 1)
      enemyData.enemySpeed.splice(index, 1)
    }
  }