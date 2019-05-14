import 'phaser';

//i've seen better ways to do this but can't figure it out
import cardinalRImg from './assets/cardinalRight.png';
import blueRImg from './assets/blueJayRight.png';
//import birdLImg from './assets/blueJayLeft.png';
import treeImg from './assets/tree.png';
import crateImg from './assets/crate.png';
import bombImg from './assets/bomb.png';

//loading sound is not working, not sure why
//import skyMall from './assets/skyMall.mp3';

//this is used to avoid having to making global variables for everything
//that we need to pass between the preload create and update functions
var gameState = {};

// var keysPlayer1;
//var keysPlayer2;
// var player1;
// var player2;


  //var player;

export default class GameScene extends Phaser.Scene {
  //calling the super constructor
  constructor(){
    super('Game')
  }

  preload(){
    //you can load images from the web like this
    //this.load.image('cardinalR', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/sky.jpg');

    //why doesn't this work vvv
    //this.load.image('cardinalR', './assets/logo.png');
		this.load.image('cardinalR', cardinalRImg);
 		this.load.image('blueJayR', blueRImg);
    this.load.image('crate', crateImg);
    this.load.image('tree', treeImg);
    this.load.image('bomb', bombImg);

    //this.load.audio('theme', skyMall);

  }


  create(){
    gameState.keysText = this.add.text(300, 100, '');


    //load music
    //.wav file did not work for this, think I need something more in the package for that
    //gameState.music = this.sound.add('theme');
    //gameState.music.play();

    //adding text
    this.add.text(50, 50, 'will like poop');

    this.createPlayer();
    this.createWorld();

    //how to click on stuff
    //has weird bounds that are bigger than the actual picture
    gameState.clickCrate = this.add.sprite(800, 100, 'crate');
    gameState.clickCrate.setInteractive();
    gameState.clickCrate.on('pointerup', function(){
      this.x -= 20;
    });

    //https://www.youtube.com/watch?v=sYleQ1uRmjk
    this.items = this.add.group([
      {
        key: 'crate',
        setXY:{
          x: 100,
          y: 240
        }
      },
      {
        key: 'tree',
        setXY:{
          x: 600,
          y: 440
        }
      }
    ]);
    //things have depth 0 by default
    //giving these pictures depth 1 makes them above the players
    this.items.setDepth(1);

  }

  createWorld(){

    this.genCrates();
    this.genBombs();

  }

  genCrates(){
    // gameState.crates = this.physics.add.staticGroup();
    // gameState.crates.create(400, 568, 'crate').refreshBody();
    function genCrate(){
      //how to reference height and with in config.js?
      const x = Math.random() * 1200;
      const y = Math.random() * 800;
      gameState.crates.create(x, y, 'crate').setCollideWorldBounds(true);
    }

    gameState.crates = this.physics.add.group();
    gameState.crates.create(400, 568, 'crate').setCollideWorldBounds(true);

    genCrate();

    this.physics.add.collider(gameState.player1, gameState.crates);
    this.physics.add.collider(gameState.player2, gameState.crates);
    //not sure if this causes problems or not
    this.physics.add.collider(gameState.crates, gameState.crates);
  }

  genBombs(){

    //creating bombs
    function genBomb(){
      const x = Math.random() * 1200;
      const y = Math.random() * 800;
      gameState.bombs.create(x, y, 'bomb').setScale(.2).setCollideWorldBounds(true);
    }

    gameState.bombs = this.physics.add.group();

    gameState.bombGenLoop = this.time.addEvent({
      delay: 5000,
      callback: genBomb,
      callbackScope: this,
      loop: true
    });

    //text for numBombs
    gameState.scoreText = this.add.text(250, 50,'BombsBlown: 0', { fontSize: '15px',
      fill: '#FFFFFF'})
    //bombs blow up on crates
    gameState.bombsBlown = 0;
    this.physics.add.collider(gameState.bombs, gameState.crates, function(bomb){
      bomb.destroy();
      gameState.bombsBlown += 1;
      gameState.scoreText.setText(`BombsBlown: ${gameState.bombsBlown}`);
    });

    this.physics.add.collider(gameState.player1, gameState.bombs);
    this.physics.add.collider(gameState.player2, gameState.bombs);
    this.physics.add.collider(gameState.bombs, gameState.bombs);
  }

  createPlayer(){

    //const logo = this.add.image(400, 150, 'cardinalR');
    //const bird = this.add.image(200, 450, 'blueJayR');

    // player = this.physics.add.sprite(100, 450, 'blueJayR');

    // player.setBounce(0.2);
    // player.setCollideWorldBounds(true);


    //add players to one group?
    gameState.player1 = this.physics.add.sprite(800, 300, 'blueJayR');
    gameState.player1.setScale(1.5);
    gameState.player1.setBounce(.2);
    gameState.player1.setCollideWorldBounds(true);

    gameState.player1.coolDown = 0;

    //gameState.player1 = player1;
    //this.physics.add.collider(gameState.player1, gameState.crates);

    gameState.player2 = this.physics.add.sprite(100, 300, 'cardinalR');
    gameState.player2.setCollideWorldBounds(true);
    gameState.player2.setScale(1.5);
    gameState.player2.setX(400);

    gameState.player2.coolDown = 0;

    //think I can delete this line
    gameState.players = this.physics.add.group();

    // gameState.players.create(gameState.player1);
    // gameState.players.create(gameState.player2);

    //keyboard stuff
    //combine these into one or no?, might mess things up if I do
    //player 1 keys
    gameState.keysPlayer1 = this.input.keyboard.createCursorKeys();
    //used in special movement (for dash attacking)
    gameState.player1.lastKeys = {};
    //player 2 keys
    gameState.keysPlayer2 = this.input.keyboard.addKeys('W,A,S,D');
    gameState.player2.lastKeys = {};


    this.physics.add.collider(gameState.player2, gameState.player1, () => {
      this.add.text(100, 100, 'you are dumb, click to restart!', {fontSize: '40px', fill: '#FFFFFF'});
      this.stopGame();

      this.input.on('pointerup', () => {
        this.restartGame();
      })
    });
    //this.physics.add.collider(gameState.players, player);
  }

  //do everything necessary to pause the game
  stopGame(){
      //stop generating bombs
      gameState.bombGenLoop.destroy();
      //stop physics
      this.physics.pause();
  }

  //do everything necessary to restart the game
  restartGame(){
    this.scene.restart();
  }

  update (){
    //these two methods could easily be consolidated into a single and separate function
    //player1 movement
    gameState.player1.setVelocity(0);
    if(gameState.player1.coolDown == 0){
      this.player1Movement();
    }
    else{
      gameState.player1.coolDown -= 1;
    }

    //player2 movement
    gameState.player2.setVelocity(0);
    if(gameState.player2.coolDown == 0){
      this.player2Movement();
    }
    else{
      gameState.player2.coolDown -= 1;
    }

  }

  player1Movement(){

    if (gameState.keysPlayer1.left.isDown)
    {
        gameState.player1.setVelocityX(-300);
        gameState.player1.flipX = true;
    }
    else if (gameState.keysPlayer1.right.isDown)
    {
        gameState.player1.setVelocityX(300);
        gameState.player1.flipX = false;
    }

    if (gameState.keysPlayer1.up.isDown)
    {
        gameState.player1.setVelocityY(-300);
    }
    else if (gameState.keysPlayer1.down.isDown)
    {
        gameState.player1.setVelocityY(300);
    }
    this.specialMovement1();
  }

  player2Movement(){
      //player2 movement

      if (gameState.keysPlayer2.A.isDown)
      {
          gameState.player2.setVelocityX(-300);
      }
      else if (gameState.keysPlayer2.D.isDown)
      {
          gameState.player2.setVelocityX(300);
      }

      if (gameState.keysPlayer2.W.isDown)
      {
          gameState.player2.setVelocityY(-300);
      }
      else if (gameState.keysPlayer2.S.isDown)
      {
          gameState.player2.setVelocityY(300);
      }
      this.specialMovement2();
  }

  //I think this is where the dashing problem is
  move(key, multiplier){
    //key is a number instead of a pointer which is the problem
    //this.add.text(600, 600, key);
    if(key == gameState.player1.lastKeys.left){
      gameState.player1.setVelocityX(-300 * multiplier);
    }
    if(key == gameState.player1.lastKeys.right){
      gameState.player1.setVelocityX(300 * multiplier);
    }
    if(key == gameState.player1.lastKeys.up){
      gameState.player1.setVelocityY(-300 * multiplier);
    }
    if(key == gameState.player1.lastKeys.down){
      gameState.player1.setVelocityY(300 * multiplier);
    }

    if(key == gameState.player2.lastKeys.A){
      gameState.player2.setVelocityX(-300 * multiplier);
    }
    if(key == gameState.player2.lastKeys.D){
      gameState.player2.setVelocityX(300 * multiplier);
    }
    if(key == gameState.player2.lastKeys.W){
      gameState.player2.setVelocityY(-300 * multiplier);
    }
    if(key == gameState.player2.lastKeys.S){
      gameState.player2.setVelocityY(300 * multiplier);
    }
  }

  specialMovement1(){
      this.specialMovement(gameState.player1.lastKeys);

      if(Phaser.Input.Keyboard.JustDown(gameState.keysPlayer1.left)){
        //could I send this in as a pointer instead of an int value?
        gameState.player1.lastKeys.left = this.specialMovementKeyVal(gameState.player1.lastKeys.left);
      }
      if (Phaser.Input.Keyboard.JustDown(gameState.keysPlayer1.right)){
        gameState.player1.lastKeys.right = this.specialMovementKeyVal(gameState.player1.lastKeys.right);
      }
      if (Phaser.Input.Keyboard.JustDown(gameState.keysPlayer1.up)){
        gameState.player1.lastKeys.up = this.specialMovementKeyVal(gameState.player1.lastKeys.up);
      }
      if (Phaser.Input.Keyboard.JustDown(gameState.keysPlayer1.down)){
        gameState.player1.lastKeys.down = this.specialMovementKeyVal(gameState.player1.lastKeys.down);
      }
  }

  specialMovement2(){
        this.specialMovement(gameState.player2.lastKeys);
        //player 2
        if(Phaser.Input.Keyboard.JustDown(gameState.keysPlayer2.A)){
          //could I send this in as a pointer instead of an int value?
          gameState.player2.lastKeys.A = this.specialMovementKeyVal(gameState.player2.lastKeys.A);
        }
        if (Phaser.Input.Keyboard.JustDown(gameState.keysPlayer2.D)){
          gameState.player2.lastKeys.D = this.specialMovementKeyVal(gameState.player2.lastKeys.D);
        }
        if (Phaser.Input.Keyboard.JustDown(gameState.keysPlayer2.W)){
          gameState.player2.lastKeys.W = this.specialMovementKeyVal(gameState.player2.lastKeys.W);
        }
        if (Phaser.Input.Keyboard.JustDown(gameState.keysPlayer2.S)){
          gameState.player2.lastKeys.S = this.specialMovementKeyVal(gameState.player2.lastKeys.S);
        }
  }

  //lKeys is a lastKeys object
  specialMovement(lKeys){
    let str = '';
    for (var key in lKeys) {
      if (lKeys[key] >= 1) {
        lKeys[key] -= 1;
      }
      else if(lKeys[key] <= -1){
        this.move(lKeys[key], 3);
        if(lKeys[key] == -1){
          this.setCoolDown(lKeys[key]);
        }
        lKeys[key] += 1;
      }
      str += key +': ' + lKeys[key] + ' ; ';
    }

    //doesn't show up for player1, because player2 happens second in the same frame
    gameState.keysText.setText(str);

  }

  //remember this is only comparing values not pointers but should still work
  //coolDown of 30 frames currently
  setCoolDown(key){
    if(gameState.player1.lastKeys.left == key ||
      gameState.player1.lastKeys.right == key ||
      gameState.player1.lastKeys.up == key ||
      gameState.player1.lastKeys.down == key){
        gameState.player1.coolDown = 30;
    }
    else if(gameState.player2.lastKeys.A == key ||
      gameState.player2.lastKeys.D == key ||
      gameState.player2.lastKeys.W == key ||
      gameState.player2.lastKeys.S == key){
        gameState.player2.coolDown = 30;
    }
  }

  specialMovementKeyVal(key){
    if(key > 0){
        //gameState.player1.setVelocityX(-2400);
        return -15;
      }
      else{
        return 12;
      }
  }

}
