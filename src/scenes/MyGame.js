import Phaser from 'phaser';
import backgroundImg from '../assets/background/bg_layer1.png';
import platformImg from '../assets/environment/ground_grass.png';
import bunnyStandImg from '../assets/player/bunny1_stand.png';

export default class MyGame extends Phaser.Scene {
  /* ==== TYPES ==== */
  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;
  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms;
  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;

  constructor() {
    // Every Scene needs a unique key, defined in super('key')
    super('game');
  }

  preload() {
    this.load.image('background', backgroundImg);
    this.load.image('platform', platformImg);
    this.load.image('bunnyStand', bunnyStandImg);

    /* ==== Init KEYBOARD INPUT ==== */
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    /* ==== SET BACKGROUND ==== */
    this.add.image(400, 300, 'background').setScrollFactor(1, 0);

    /* ==== GENERATE PLATFORMS ==== */
    this.platforms = this.physics.add.staticGroup();
    const numberOfPlatforms = 5;
    for (let i = 0; i < numberOfPlatforms; i++) {
      const x = Phaser.Math.Between(200, 600);
      const y = 150 * i;
      const platform = this.platforms.create(x, y, 'platform');
      platform.scaleX = 0.5;
      platform.scaleY = 0.35;

      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = platform.body;

      /**
       * Refresh the physics body based on any changes
       * we made to the GameObject like position and scale
       */
      body.updateFromGameObject();
    }

    /* ==== Init PLAYER CHARACTER ==== */
    this.player = this.physics.add.image(400, 300, 'bunnyStand').setScale(0.4);

    /* ==== Init COLLISIONS ==== */
    this.physics.add.collider(this.platforms, this.player);

    /* ==== Init CAMERA ==== */
    this.cameras.main.startFollow(this.player);
    // set the horizontal dead zone to 1.5x game width
    this.cameras.main.setDeadzone(this.scale.width * 1.5);
  }

  /* ==== update() UTILITY VARIABLES ==== */
  allowFastFall = true;

  update(t, dt) {
    /* ==== CONSOLE.LOG ==== */

    /* ==== Init COLLISION CONDITIONS ==== */
    // find out from Arcade Physics if the player's physics body
    // is touching something below it
    const touchingDown = this.player.body.touching.down;
    if (touchingDown) {
      this.allowFastFall = false;
      this.player.setVelocityY(-500);
    }

    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;

    /* ==== Init INFINITE PLATFORM feature ==== */
    this.platforms.children.iterate((child) => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child;

      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 80);
        platform.x = Phaser.Math.Between(200, 600);
        platform.body.updateFromGameObject();
      }
    });

    /* ==== Init FASTFALL conditions ==== */
    const playerVelocityY = this.player.body.velocity.y;
    if (playerVelocityY >= -50 && playerVelocityY <= 50 && !touchingDown) {
      this.allowFastFall = true;
    }

    /* ==== Init KEYBOARD INPUT BEHAVIOUR ==== */
    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(200);
    } else if (this.cursors.down.isDown && this.allowFastFall) {
      // FAST FALL
      this.player.setVelocityY(600);
    } else {
      this.player.setVelocityX(0);
    }

    /* ==== HORIZONTAL WRAP PLAYER ==== */
    this.horizontalWrap(this.player);
  }

  /* ==== Method HORIZONTAL WRAP ==== */
  // If the passed in sprite goes past the left side
  // more than half its width then teleport it to the
  // right side plus half its width, and vice versa
  /** @param {Phaser.GameObjects.Sprite} sprite */
  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5;
    const gameWidth = this.scale.width;
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
    }
  }
}
