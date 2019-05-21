import 'phaser';

//importing player class
import Player from "./Player.js"
import Base from "./Base.js"

import cardinalRImg from './assets/cardinalRight.png';
import blueJay from './assets/blueJay.png'
import redBase from './assets/redGate.png';
import blueBase from './assets/blueGate.png';
import worm from './assets/Worm.png';
//loading sound is not working, not sure why
//import skyMall from './assets/skyMall.mp3';

//this is used to avoid having to making global variables for everything
//that we need to pass between the preload create and update functions
var gameState = {};
gameState.width = 1200;
gameState.height = 800;

export default class GameScene extends Phaser.Scene {
  //calling the super constructor
  constructor(){
    super('Game');
  }

  preload(){
    //you can load images from the web like this
    //this.load.image('cardinalR', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/sky.jpg');

    //why doesn't this work vvv
    //this.load.image('cardinalR', './assets/logo.png');
    this.load.image('cardinalR', cardinalRImg);
    this.load.spritesheet('blueJay', blueJay, {frameWidth: 23, frameHeight: 32});
    this.load.spritesheet('redBase', redBase, {frameWidth: 200, frameHeight: 500});
    this.load.spritesheet('blueBase', blueBase, {frameWidth: 200, frameHeight: 500});
    this.load.image('worm', worm);
    //this.load.audio('theme', skyMall);
  }

  create(){

    gameState.keysText = this.add.text(300, 100, '');
    //this.add.text(50, 50, 'will like poop');
    this.createPlayer();
    this.createBases();
    this.genWorm();

  }

  //called once
  createPlayer(p1 = true, p2 = true){
    //calls player create functions
    if (p1){
      this.createPlayer1()
      gameState.player1.respawnCounter = -1;
    }
    if (p2){
      this.createPlayer2()
      gameState.player2.respawnCounter = -1;
    }

    if(!(gameState.player1 === null || gameState.player2 === null)){
      this.physics.add.collider(gameState.player2, gameState.player1, () => {
        this.gotBeaked();
      })
    }

    this.createPlayerText();

  }

  createPlayer1(){
    gameState.keysPlayer1 = this.input.keyboard.addKeys('UP,DOWN,LEFT,RIGHT,PERIOD');

    //add players to one group?
    gameState.player1 = this.physics.add.sprite(gameState.width * .75, gameState.height * .5, 'blueJay');
    gameState.player1 = new Player(gameState.player1, gameState.keysPlayer1);
    gameState.player1.functions.poop();
    //gameState.player1.functions.poop();
    gameState.player1.animArr[0] = this.anims.create({
      key: 'movementLeft',
      frames: [ { key: 'blueJay', frame: 1 }, { key: 'blueJay', frame: 0 } ],
      frameRate: 10,
      repeat: -1
    });
    gameState.player1.animArr[1] = this.anims.create({
      key: 'movementRight',
      frames: [ { key: 'blueJay', frame: 3 }, { key: 'blueJay', frame: 2 } ],
      frameRate: 10,
      repeat: -1
    });
    gameState.player1.animArr[2] = this.anims.create({
      key: 'standLeft',
      frames: this.anims.generateFrameNumbers('blueJay', { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1
    });
    gameState.player1.animArr[3] = this.anims.create({
      key: 'standRight',
      frames: this.anims.generateFrameNumbers('blueJay', { start: 2, end: 2 }),
      frameRate: 10,
      repeat: -1
    });
  }

  //gameState.player1 = player1;
  //this.physics.add.collider(gameState.player1, gameState.crates);
  createPlayer2(){
    gameState.keysPlayer2 = this.input.keyboard.addKeys('W,S,A,D,Q');
    gameState.player2 = this.physics.add.sprite(gameState.width * .25, gameState.height * .5, 'cardinalR');
    gameState.player2 = new Player(gameState.player2, gameState.keysPlayer2);
    gameState.player2.functions.poop();
  }

  //creates the bases for both teams. Open when a player dies.
  createBases(){
    var animArrRed = [];
    var redBase = this.physics.add.sprite(0, gameState.height / 2, 'redBase');
    redBase.setImmovable(true);

    animArrRed[1] = this.anims.create({
      key: 'openR',
      frames: this.anims.generateFrameNumbers('redBase', { start: 1, end: 1 }),
      frameRate: 10,
      repeat: 1
    });
    animArrRed[0] = this.anims.create({
      key: 'closeR',
      frames: this.anims.generateFrameNumbers('redBase', { start: 0, end: 0 }),
      frameRate: 10,
      repeat: 1
    });

    gameState.player2.base = new Base(redBase, animArrRed);

    this.physics.add.collider(gameState.player1, gameState.player2.base.sprite, () => {
      if (gameState.player2.base.isOpen){
        gameState.player1.functions.addScore(3);
        gameState.player1.functions.respawn();
      }
    })


    var blueBase = this.physics.add.sprite(gameState.width, gameState.height / 2, 'blueBase');
    blueBase.setImmovable(true);
    var animArrBlue = [];
    animArrBlue[1] = this.anims.create({
      key: 'openB',
      frames: this.anims.generateFrameNumbers('blueBase', { start: 1, end: 1 }),
      frameRate: 10,
      repeat: 1
    });
    animArrBlue[0] = this.anims.create({
      key: 'closeB',
      frames: this.anims.generateFrameNumbers('blueBase', { start: 0, end: 0 }),
      frameRate: 10,
      repeat: 1
    });

    gameState.player1.base = new Base(blueBase, animArrBlue);

    this.physics.add.collider(gameState.player2,  gameState.player1.base.sprite, () => {
      if (gameState.player1.base.isOpen){
        gameState.player2.functions.addScore(3);
        gameState.player2.functions.respawn();
      }
    })
  }

  createPlayerText(){
    gameState.player1.scoreText = this.add.text(1050, 50, '0', { fontSize: '45px',
    fill: '#FFFFFF'});
    //score goes in front of players
    gameState.player1.scoreText.setDepth(1);

    gameState.player2.scoreText = this.add.text(100, 50, '0', { fontSize: '45px',
    fill: '#FFFFFF'});
    gameState.player2.scoreText.setDepth(1);
  }

  genWorm(){

    //puts new worm in random place
    function genWorm(){
      const x = (Math.random() * (gameState.width - 200)) + 100;
      const y = Math.random() * gameState.height;
      gameState.worm.create(x, y, 'worm');
    }


    gameState.worm = this.physics.add.staticGroup();

    //loop for calling worms, change delay to change span pace
    gameState.wormGenLoop = this.time.addEvent({
      delay: 8000,
      callback: genWorm,
      callbackScope: this,
      loop: true
    });

    this.physics.add.overlap(gameState.worm, gameState.player1, (player, worm) => {
      this.ateWorm(player, worm);
    });
    this.physics.add.overlap(gameState.worm, gameState.player2, (player, worm) => {
      this.ateWorm(player, worm);
    });
  }

  getOtherPlayer(player){
    if(player == gameState.player1){
      return gameState.player2;
    }
    else{
      return gameState.player1;
    }
  }

  gotBeaked(){
    if(gameState.player1.isDashing && gameState.player2.isDashing){
      gameState.player1.functions.kill(gameState.player2);
      gameState.player2.functions.kill(gameState.player1);

      //watch out here, kill also affects whether bases are open, could make a separate kill function for a tie
      gameState.player1.base.setOpen(true);
      gameState.player2.base.setOpen(true);
    }
    else{
      if (gameState.player1.isDashing){
        gameState.player1.functions.kill(gameState.player2);
      }
      if (gameState.player2.isDashing){
        gameState.player2.functions.kill(gameState.player1);
      }
    }
  }

  //Adds points when worms are eaten
  ateWorm(player, worm){
    if (! player.isDashing){
      player.wormCount += 1;
      worm.destroy();
    }
  }

  //do everything necessary to restart the game
  restartGame(){
    this.scene.restart();
  }

  update(){
    gameState.player1.functions.updatePlayer();
    gameState.player2.functions.updatePlayer();
  }
}
