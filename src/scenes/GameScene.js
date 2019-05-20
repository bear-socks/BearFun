import 'phaser';

//importing player class
import Player from "./Player.js"

import cardinalRImg from './assets/cardinalRight.png';
import blueJay from './assets/blueJay.png'
import treeImg from './assets/tree.png';
import crateImg from './assets/crate.png';
import bombImg from './assets/bomb.png';
import redBase from './assets/redGate.png';
import blueBase from './assets/blueGate.png'
//loading sound is not working, not sure why
//import skyMall from './assets/skyMall.mp3';

//this is used to avoid having to making global variables for everything
//that we need to pass between the preload create and update functions
var gameState = {};
gameState.width = 1200;
gameState.height = 800;
//the speed of each player
gameState.speed = 200;

var LEFT = 0;
var RIGHT = 1;

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
    //this.load.image('blueJayR', blueRImg);
    this.load.image('crate', crateImg);
    this.load.image('tree', treeImg);
    this.load.image('bomb', bombImg);
    this.load.spritesheet('redBase', redBase, {frameWidth: 200, frameHeight: 500});
    this.load.spritesheet('blueBase', blueBase, {frameWidth: 200, frameHeight: 500});
    //this.load.audio('theme', skyMall);

  }

  create(){

    gameState.keysText = this.add.text(300, 100, '');

    //this.add.text(50, 50, 'will like poop');

    this.createWorld();
    this.createPlayer();
    this.createBases();

    //how to click on stuff
    // gameState.clickCrate = this.add.sprite(800, 100, 'crate');
    // gameState.clickCrate.setInteractive();
    // gameState.clickCrate.on('pointerup', function(){
    //   this.x -= 20;
    // });

    //https://www.youtube.com/watch?v=sYleQ1uRmjk
    // this.items = this.add.group([
    //   {
    //     key: 'crate',
    //     setXY:{
    //       x: 100,
    //       y: 240
    //     }
    //   },
    //   {
    //     key: 'tree',
    //     setXY:{
    //       x: 600,
    //       y: 440
    //     }
    //   }
    // ]);
    //things have depth 0 by default
    //giving these pictures depth 1 makes them above the players
    // this.items.setDepth(1);

  }

  createWorld(){
    //this.genCrates();
    //this.genBombs();
  }

  //   // gameState.crates = this.physics.add.staticGroup();

  //   function genBomb(){
  //     const x = Math.random() * 1200;
  //     const y = Math.random() * 800;
  //     gameState.bombs.create(x, y, 'bomb').setScale(.2).setCollideWorldBounds(true);
  //   }
  //
  //   gameState.bombs = this.physics.add.group();
  //
        //HOW TO DO SOMETHING PERIODICALLY
  //   gameState.bombGenLoop = this.time.addEvent({
  //     delay: 5000,
  //     callback: genBomb,
  //     callbackScope: this,
  //     loop: true
  //   });
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
    gameState.keysPlayer1 = this.input.keyboard.createCursorKeys();

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
    gameState.keysPlayer2 = this.input.keyboard.addKeys('W,S,A,D');
    gameState.player2 = this.physics.add.sprite(gameState.width * .25, gameState.height * .5, 'cardinalR');
    gameState.player2 = new Player(gameState.player2, gameState.keysPlayer2);
    gameState.player2.functions.poop();
  }


  //creates the bases for both teams. Open when a player dies.
  createBases(){
    gameState.redBase = this.physics.add.sprite(0, 0, 'redBase');
    gameState.redBase.setPosition(0, gameState.height / 2);
    gameState.redBase.open = false;
    gameState.redBase.setImmovable(true);
    this.anims.create({
      key: 'openR',
      frames: this.anims.generateFrameNumbers('redBase', { start: 1, end: 1 }),
      frameRate: 10,
      repeat: 1
    });
    this.anims.create({
      key: 'closeR',
      frames: this.anims.generateFrameNumbers('redBase', { start: 0, end: 0 }),
      frameRate: 10,
      repeat: 1
    });
    this.physics.add.collider(gameState.player1, gameState.redBase, () => {
      if (gameState.redBase.open){
        gameState.player1.functions.addScore(3);
        gameState.player1.functions.respawn();
      }
    })

    gameState.blueBase = this.physics.add.sprite(0, 0, 'blueBase');
    gameState.blueBase.setPosition(gameState.width, gameState.height / 2);
    gameState.blueBase.open = false;
    gameState.blueBase.setImmovable(true);
    this.anims.create({
      key: 'openB',
      frames: this.anims.generateFrameNumbers('blueBase', { start: 1, end: 1 }),
      frameRate: 10,
      repeat: 1
    });
    this.anims.create({
      key: 'closeB',
      frames: this.anims.generateFrameNumbers('blueBase', { start: 0, end: 0 }),
      frameRate: 10,
      repeat: 1
    });
    this.physics.add.collider(gameState.player2, gameState.blueBase, () => {
      if (gameState.blueBase.open){
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

  getOtherPlayer(player){
    if(player == gameState.player1){
      return gameState.player2;
    }
    else{
      return gameState.player1;
    }
  }

  gotBeaked(){
    if (gameState.player1.isDashing){
      gameState.player1.functions.kill(gameState.player2);
      gameState.player2.respawnCounter = 100;
      //opens red base
      gameState.redBase.anims.play('openR', true);
      gameState.redBase.open = true;
      gameState.blueBase.open = false;
      gameState.blueBase.anims.play('closeB', true);
    }
    if (gameState.player2.isDashing){

      gameState.player2.functions.kill(gameState.player1);
      gameState.player1.respawnCounter = 100;

      //opens blue base
      gameState.blueBase.anims.play('openB', true);
      gameState.blueBase.open = true;
      gameState.redBase.open = false;
      gameState.redBase.anims.play('closeR', true);
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
