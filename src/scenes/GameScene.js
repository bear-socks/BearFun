import 'phaser';

//importing player class
import Player from "./Player.js"

//i've seen better ways to do this but can't figure it out
import cardinalRImg from './assets/cardinalRight.png';
//import blueRImg from './assets/blueJayRight.png';
//import birdLImg from './assets/blueJayLeft.png';
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
// var keysPlayer1;
//var keysPlayer2;
// var player1;
// var player2;


//var player;



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

  // genCrates(){
  //   // gameState.crates = this.physics.add.staticGroup();
  //   // gameState.crates.create(400, 568, 'crate').refreshBody();
  //   function genCrate(){
  //     //how to reference height and with in config.js?
  //     const x = Math.random() * 1200;
  //     const y = Math.random() * 800;
  //     gameState.crates.create(x, y, 'crate').setCollideWorldBounds(true);
  //   }
  //
  //   gameState.crates = this.physics.add.group();
  //   gameState.crates.create(400, 568, 'crate').setCollideWorldBounds(true);
  //
  //   genCrate();
  //
  //   //not sure if this causes problems or not
  //   this.physics.add.collider(gameState.crates, gameState.crates);
  // }

  // genBombs(){
  //
  //   //creating bombs
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
  //
  //   //text for numBombs
  //   gameState.scoreText = this.add.text(250, 50,'BombsBlown: 0', { fontSize: '15px',
  //   fill: '#FFFFFF'})
  //   //bombs blow up on crates
  //   gameState.bombsBlown = 0;
  //   this.physics.add.collider(gameState.bombs, gameState.crates, function(bomb){
  //     bomb.destroy();
  //     gameState.bombsBlown += 1;
  //     //gameState.scoreText.setText(`BombsBlown: ${gameState.bombsBlown}`);
  //   });
  //
  //   this.physics.add.collider(gameState.bombs, gameState.bombs);
  // }

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

    //gameState.players = this.physics.add.group();

    // gameState.players.create(gameState.player1);
    // gameState.players.create(gameState.player2);

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
    this.anims.create({
      key: 'movementLeft',
      frames: [ { key: 'blueJay', frame: 1 }, { key: 'blueJay', frame: 0 } ],
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'movementRight',
      frames: [ { key: 'blueJay', frame: 3 }, { key: 'blueJay', frame: 2 } ],
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'standLeft',
      frames: this.anims.generateFrameNumbers('blueJay', { start: 0, end: 0 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
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
    gameState.redBase.setPosition(gameState.redBase.width / 2, gameState.height / 2);
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
    gameState.blueBase.setPosition(gameState.width - gameState.blueBase.width / 2, gameState.height / 2);
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
    //these two methods could easily be consolidated into a single and separate function
    //player1 movement
    //if reset is -1, player is alive
    // console.log(gameState.player1.respawnCounter);
    // console.log(gameState.player2.respawnCounter);
    if (gameState.player1.respawnCounter == -1){

      gameState.player1.setVelocity(0);
      if(gameState.player1.coolDown == 0){
        this.player1Movement();
      }
      else{
        gameState.player1.coolDown -= 1;
      }
    }
    else if (gameState.player1.respawnCounter == 0){
      gameState.player1.respawnCounter = -1;
      gameState.player1.functions.respawn();
    }
    else{
      gameState.player1.respawnCounter -= 1;
    }

    //player2 movement
    if (gameState.player2.respawnCounter == -1){
      //this line should only happen when the player2 object comes back but is happening before it does
      //when both the birds kill each other at the same time
      //console.log("hi2");
      gameState.player2.setVelocity(0);
      if(gameState.player2.coolDown == 0){
        this.player2Movement();
      }
      else{
        gameState.player2.coolDown -= 1;
      }
    }
    else if (gameState.player2.respawnCounter == 0){
      gameState.player2.respawnCounter = -1;
      gameState.player2.functions.respawn();
    }
    else{
      gameState.player2.respawnCounter -= 1;

    }
  }

  //need to consolidate animations into the player class
  player1Movement(){
    gameState.player1.movingY = false;

    if (gameState.keysPlayer1.up.isDown)
    {
      gameState.player1.anims.play(`movement${gameState.player1.directionX}`, true);
      gameState.player1.movingY = true;

    }
    else if (gameState.keysPlayer1.down.isDown)
    {
      gameState.player1.anims.play(`movement${gameState.player1.directionX}`, true);
      gameState.player1.movingY = true;
    }

    if (gameState.keysPlayer1.left.isDown)
    {
      gameState.player1.anims.play('movementLeft', true);
      gameState.player1.directionX = 'Left';
    }
    else if (gameState.keysPlayer1.right.isDown)
    {
      gameState.player1.anims.play('movementRight', true);
      gameState.player1.directionX = 'Right';
    }
    else if (!gameState.player1.movingY && gameState.player1.directionX == 'Left'){
      gameState.player1.anims.play('standLeft', true);
    }
    else if(!gameState.player1.movingY){
      gameState.player1.anims.play('standRight', true);
    }

    gameState.player1.functions.movement();
    this.specialMovement(gameState.player1);
  }

  player2Movement(){
    //player2 movement
    gameState.player2.functions.movement()
    this.specialMovement(gameState.player2);
  }

  //lKeys is a lastKeys object
  specialMovement(player){
    //
    //console.log(gameState.player2.directKeys[1]);
    player.functions.specialMovementCheck();
    let str = '';
    gameState.dashingVar = false;
    for (var i = 0; i <= 3; i++){
      //not dashing
      if (player.lastKeys[i] >= 1) {
        player.lastKeys[i] -= 1;
      }
      //dashing
      else if(player.lastKeys[i] <= -1){
        //console.log(key);
        player.functions.move(i, 3);
        gameState.dashingVar = true;
        if(player.lastKeys[i] == -1){
          gameState.dashingVar = false;
          player.functions.setCoolDown();
        }
        player.lastKeys[i] += 1;
      }

      str += i +': ' + player.lastKeys[i] + ' ; ';
    }
    //console.log(str);
    player.isDashing = gameState.dashingVar;

    //doesn't show up for player1, because player2 happens second in the same frame
    //gameState.keysText.setText(str);

  }
  //
  // specialMovementKeyVal(key){
  //   if(key > 0){
  //     //gameState.player1.setVelocityX(-2400);
  //     return -15;
  //   }
  //   else{
  //     return 12;
  //   }
  // }
}
