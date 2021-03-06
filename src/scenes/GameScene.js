
//importing classes
import Player from "./Player.js";
import Base from "./Base.js";
import TreeTiling from "./TreeTiling.js";
import Turret from "./Turret.js";

import cardinalRImg from './assets/cardinalRight.png';
import blueJay from './assets/blueJay.png'
import redBase from './assets/redGate.png';
import blueBase from './assets/blueGate.png';
import worm from './assets/worm.png';
import redTurret from './assets/redTurret.png';
import blueTurret from './assets/blueTurret.png';
import nothing from './assets/nothing.png';
import blueBullet from "./assets/blueBullet.png";
import redBullet from "./assets/redBullet.png";


//loading sound is not working, not sure why
//import tskyMall from './assets/skyMall.mp3';

//this is used to avoid having to making global variables for everything
//that we need to pass between the preload create and update functions
var gameState = {};
gameState.width = 1184; //37 * 32
gameState.height = 672; //21 * 32
//should be bound to the value in treetiling but isn't
gameState.size = 32;

export default class GameScene extends Phaser.Scene {
  //calling the super constructor
  constructor(){
    super('Game');
  }

  preload(){
    //you can load images from the web like this
    //this.load.image('tcardinalR', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/sky.jpg');

    //why doesn't this work vvv
    //this.load.image('tcardinalR', './assets/logo.png');
    this.load.image('cardinalR', cardinalRImg);
    this.load.image('redTurret', redTurret);
    this.load.image('blueTurret', blueTurret);
    this.load.image('nothing', nothing);
    this.load.image('blueBullet', blueBullet);
    this.load.image('redBullet', redBullet);
    this.load.spritesheet('blueJay', blueJay, {frameWidth: 23, frameHeight: 32});
    this.load.spritesheet('redBase', redBase, {frameWidth: 200, frameHeight: 500});
    this.load.spritesheet('blueBase', blueBase, {frameWidth: 200, frameHeight: 500});
    this.load.spritesheet('worm', worm, {frameWidth: 6, frameHeight: 15});
    //this.load.image('tworm', worm);
    //this.load.audio('theme', skyMall);

    gameState.levels = [];
    gameState.levelNum = 0;
    for(var i = -2; i <= 2; i++){
      gameState.levels[i] = new TreeTiling(this, gameState.width, gameState.height);

      gameState.graphics = this.add.graphics({x: 0, y: 0});
      //var circle = Phaser.Geom.Circle(gameState.width, 32, 16);
      //graphics.fillCircle(500, 500, 500);
      gameState.graphics.fillStyle(0xAAAAAA, 1.0);

      gameState.graphics.fillCircle((gameState.width / 2) + i * 64, 50, 14).setDepth(5);
      //graphics.fillRect(50, 50, 400, 200);
    }
  }

  create(){
    //gameState.treeTiling = new TreeTiling(this);
    gameState.levels[gameState.levelNum].display();

    var markerG = this.add.graphics({x: 0, y: 0});
    markerG.lineStyle(3, 0x00FF00, 1.0);
    gameState.marker = markerG.strokeCircle((gameState.width / 2) + gameState.levelNum * 64, 50, 20).setDepth(5);

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
    //gameState.player2.functions.poop();
  }

  //creates the bases for both teams. Open when a player dies.
  createBases(){
    var animArrRed = [];
    var redBase = this.physics.add.sprite(0, gameState.height / 2, 'redBase').setScale(.5);
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
        this.enterBase(gameState.player1, gameState.player2);
      }
    })


    var blueBase = this.physics.add.sprite(gameState.width, gameState.height / 2, 'blueBase').setScale(.5);
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
        this.enterBase(gameState.player2, gameState.player1);
      }
    })
  }

  //play1 entered play2's base
  enterBase(play1, play2){
    play1.functions.addScore(3);
    play1.functions.respawn();
    play2.functions.setBaseOpen(false);
    if(play1 == gameState.player1){
      this.loadLevel(-1)
    }
    else{
      this.loadLevel(1)
    }
    if (gameState.player1.turret){
      gameState.p1turret.changeMatrix(gameState.levels[gameState.levelNum].passMatrix());
    }
    if (gameState.player2.turret){
      gameState.p2turret.changeMatrix(gameState.levels[gameState.levelNum].passMatrix());
    }
  }

  loadLevel(inc){
    gameState.levels[gameState.levelNum].stopDisplay();
    gameState.levelNum += inc;
    var level = gameState.levels[gameState.levelNum];

    try {
      gameState.levels[gameState.levelNum].display();
    }
    catch(err){
      this.gameOver();
    }
    this.updateMarker();
  }

  updateMarker(){
    //actually moves it this much instead of position the graphics
    //because this is moving the whole graphics object, not just the marker
    gameState.marker.setPosition(gameState.levelNum * 64, 0);
  }

  gameOver(){
    var txt = this.add.text(0, 0, this.getWinner() +
    " absolutely destroyed \n and won the game \n and saved the world!",
    { fontSize: '45px', fill: '#FFFFFF'})
    .setDepth(3);

    txt.setPosition((gameState.width / 2) - txt.width / 2, (gameState.height / 2) - txt.height / 2);

    this.physics.pause();
  }

  getWinner(){
    if(gameState.levelNum < 0){
      return "Blue Jay";
    }
    else{
      return "Cardinal";
    }
  }

  createPlayerText(){
    //possibly point this two lines below into the initText? pass in the scene object as a parameter?
    gameState.player1.scoreText = this.add.text(0, 0, '0', { fontSize: '45px',
    fill: '#FFFFFF'});
    gameState.player1.wormText = this.add.text(0, 0, '0', { fontSize: '25px',
    fill: '#FFFFFF'});
    gameState.player1.functions.initText(gameState.width - gameState.size * 3, 50);

    //player2
    gameState.player2.scoreText = this.add.text(0, 0, '0', { fontSize: '45px',
    fill: '#FFFFFF'});
    gameState.player2.wormText = this.add.text(0, 0, '0', { fontSize: '25px',
    fill: '#FFFFFF'});
    gameState.player2.functions.initText(gameState.size * 3, 50);
  }

  genWorm(){

    //puts new worm in random place
    function genWorm(){
      const x = (Math.random() * (gameState.width - 200)) + 100;
      const y = Math.random() * gameState.height;
      gameState.worm.create(x, y, 'worm');
      gameState.worm.playAnimation(gameState.worm.animArr[0]);
    }

    gameState.worm = this.physics.add.staticGroup();

    //loop for calling worms, change delay to change span pace
    gameState.wormGenLoop = this.time.addEvent({
      delay: 8000,
      callback: genWorm,
      callbackScope: this,
      loop: true
    });

    gameState.worm.animArr = []
    gameState.worm.animArr[0] = this.anims.create({
      key: 'wormDance',
      frames: [ { key: 'worm', frame: 0 }, { key: 'worm', frame: 1 } ],
      frameRate: 4,
      repeat: -1
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
      //console.log("bob" + gameState.player1.hasPriority);
      if((gameState.player1.hasPriority && gameState.player2.hasPriority) || (!gameState.player1.hasPriority && !gameState.player2.hasPriority)){
        gameState.player1.functions.kill(gameState.player2);
        gameState.player2.functions.kill(gameState.player1);

        //watch out here, kill also affects whether bases are open, could make a separate kill function for a tie
        gameState.player1.functions.setBaseOpen(false);
        gameState.player2.functions.setBaseOpen(false);
      }
      else{
        if(!gameState.player2.hasPriority){
          gameState.player1.functions.kill(gameState.player2);
        }
        if(!gameState.player1.hasPriority){
          gameState.player2.functions.kill(gameState.player1);
        }
      }
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
    //if (!player.isDashing){
    player.functions.addWorms(1);
    worm.destroy();// DEBUG:
    //}
  }



  //makes a turret
  turret(player){
    player.newTurret = false;
    if (player == gameState.player1){
      gameState.p1turret = this.physics.add.sprite(player.x, player.y, 'blueTurret').setDepth(3);
      gameState.p1turret = new Turret(gameState.p1turret, player, 'blue', gameState.levels[gameState.levelNum].passMatrix());
      gameState.p1bullets = this.physics.add.group();
      this.physics.add.collider(gameState.player2, gameState.p1bullets, (player, bullet) => {
        this.gotShot(player, bullet);
      });
      this.physics.add.collider(gameState.player1, gameState.p1turret);
      this.physics.add.collider(gameState.player2, gameState.p1turret);
    }
    else {
      gameState.p2turret = this.physics.add.sprite(player.x, player.y, 'redTurret').setDepth(3);
      gameState.p2turret = new Turret(gameState.p2turret, player, 'red', gameState.levels[gameState.levelNum].passMatrix());
      gameState.p2bullets = this.physics.add.group();
      this.physics.add.collider(gameState.player1, gameState.p2bullets, (player, bullet) => {
        this.gotShot(player, bullet);
      });
      this.physics.add.collider(gameState.player1, gameState.p2turret);
      this.physics.add.collider(gameState.player2, gameState.p2turret);


    }
  }

  fire(turret, opp){
    if (turret == gameState.p1turret){
      gameState.newBullet = this.physics.add.sprite(turret.realX, turret.realY, 'blueBullet').setDepth(3);
      gameState.p1bullets.add(gameState.newBullet);

      //the unit circle is rotated 90 degrees clockwise, so some math is needed to correct for that
      gameState.newBullet.setAngle(gameState.blueTurretAngle * 180 / Math.PI);
      gameState.newBullet.setVelocity(400 * Math.cos(gameState.blueTurretAngle + Math.PI/2), 400 * Math.sin(gameState.blueTurretAngle + Math.PI/2));
    }
    else{
      gameState.newBullet = this.physics.add.sprite(turret.realX, turret.realY, 'redBullet').setDepth(3);
      gameState.p2bullets.add(gameState.newBullet);
      gameState.newBullet.setAngle(gameState.redTurretAngle * 180 / Math.PI);
      gameState.newBullet.setVelocity(400 * Math.cos(gameState.redTurretAngle + Math.PI/2), 400 * Math.sin(gameState.redTurretAngle + Math.PI/2));
    }
  }

  //triggers death by bullets
  gotShot(player, bullet){
    bullet.destroy();
    if (player == gameState.player1) { player.functions.die(gameState.player2); }
    else { player.functions.die(gameState.player1); }
  }

  //do everything necessary to restart the game
  restartGame(){
    this.scene.restart();
  }

  update(){
    if (gameState.player1.turret){
      gameState.p1turret.update([gameState.player2.x, gameState.player2.y], gameState);
      if (gameState.p1turret.warmedUp >= 25 && (gameState.p1turret.warmedUp % 10) == 0){
        this.fire(gameState.p1turret, gameState.player2);
      }
    }
    if (gameState.player2.turret){
      gameState.p2turret.update([gameState.player1.x, gameState.player1.y], gameState);
      if (gameState.p2turret.warmedUp >= 25 && (gameState.p2turret.warmedUp % 10) == 0){
        this.fire(gameState.p2turret, gameState.player1);
      }
    }
    gameState.player1.functions.updatePlayer();
    if (gameState.player1.newTurret){
      this.turret(gameState.player1);
    }
    gameState.player2.functions.updatePlayer();
    if (gameState.player2.newTurret){
      this.turret(gameState.player2);
    }
  }

}
