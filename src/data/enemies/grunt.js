
import uuid from 'uuid';

export const grunt = {
    size: 12,
    pos: [],
    color: [],
    speed: [],
    keys: [],
    damage: 5,
    stride: 7,
    generateGrunts: (num) => {
      for (let i = 0; i < num; i++) {
        const X = Math.random() < .5 ? 0 : 900 - grunt.size*2;
        const Y = ~~(Math.random()*(600 - grunt.size*2));
        const color = `rgb(${~~(Math.random()*105)+150}, ${~~(Math.random()*80)}, ${~~(Math.random()*32)}`;
        const speed = grunt.stride + ~~(Math.random()*10);
        const key = uuid();
        grunt.pos.push([X, Y]);
        grunt.color.push(color);
        grunt.speed.push(speed);
        grunt.keys.push(key);
      }
    },
    updateGruntPos: (index, newPos) => {
      grunt.pos.splice(index, 1, newPos);
    },
    removeGrunt: (index) => {
      grunt.pos.splice(index, 1);
      grunt.keys.splice(index, 1);
      grunt.color.splice(index, 1);
      grunt.speed.splice(index, 1);
    }
  }