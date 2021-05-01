import Phaser from 'phaser';
import MyGame from './scenes/MyGame';

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 400,
      },
      debug: true,
    },
  },
  scene: MyGame,
};

const game = new Phaser.Game(config);
