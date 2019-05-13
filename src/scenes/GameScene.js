import 'phaser';

//i've seen better ways to do this but can't figure it out
import logoImg from './assets/logo.png';
import birdRImg from './assets/blueJayRight.png';
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
    //this.load.image('logo', 'https://s3.amazonaws.com/codecademy-content/courses/learn-phaser/sky.jpg');

    //why doesn't this work vvv
    //this.load.image('logo', './assets/logo.png');
		this.load.image('logo', logoImg);
 		this.load.image('bird', birdRImg);
    this.load.image('crate', crateImg);
    this.load.image('tree', treeImg);
    this.load.image('bomb', bombImg);

    //this.load.audio('theme', skyMall);

  }


  create(){
    gameState.keysText = this.add.text(300, 100, '');

    //used in special movement (for dash attacking)
    gameState.lastKeys = {};

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

    //combine these into one or no?, might mess things up if I do
    //player 1 keys
    gameState.keysPlayer1 = this.input.keyboard.createCursorKeys();
    //player 2 keys
    gameState.keysPlayer2 = this.input.keyboard.addKeys('W,A,S,D');

    //const logo = this.add.image(400, 150, 'logo');
    //const bird = this.add.image(200, 450, 'bird');

    // player = this.physics.add.sprite(100, 450, 'bird');

    // player.setBounce(0.2);
    // player.setCollideWorldBounds(true);


    //add players to one group?
    gameState.player1 = this.physics.add.sprite(600, 300, 'bird');
    gameState.player1.setScale(1.5);
    gameState.player1.setBounce(.2);
    gameState.player1.setCollideWorldBounds(true);

    //gameState.player1 = player1;
    //this.physics.add.collider(gameState.player1, gameState.crates);

    gameState.player2 = this.physics.add.sprite(150, 300, 'logo');
    gameState.player2.setCollideWorldBounds(true);
    gameState.player2.setScale(.4);
    gameState.player2.setX(400);

    gameState.players = this.physics.add.group();

    // gameState.players.create(gameState.player1);
    // gameState.players.create(gameState.player2);

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

    if (gameState.keysPlayer1.left.isDown)
    {
        gameState.player1.setVelocityX(-300);
    }
    else if (gameState.keysPlayer1.right.isDown)
    {
        gameState.player1.setVelocityX(300);
    }

    if (gameState.keysPlayer1.up.isDown)
    {
        gameState.player1.setVelocityY(-300);
    }
    else if (gameState.keysPlayer1.down.isDown)
    {
        gameState.player1.setVelocityY(300);
    }

    //player2 movement
    gameState.player2.setVelocity(0);

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

    this.specialMovement();
  }

  move(key, multiplier){
    if(key == gameState.lastKeys.left){
      gameState.player1.setVelocityX(-300 * multiplier);
    }
    if(key == gameState.lastKeys.right){
      gameState.player1.setVelocityX(300 * multiplier);
    }
    if(key == gameState.lastKeys.up){
      gameState.player1.setVelocityY(-300 * multiplier);
    }
    if(key == gameState.lastKeys.down){
      gameState.player1.setVelocityY(300 * multiplier);
    }
  }

  //bug here, dash gets messed up
  specialMovement(){
    let str = '';
    for (var key in gameState.lastKeys) {
      if (gameState.lastKeys[key] >= 1) {
        gameState.lastKeys[key] -= 1;
      }
      else if(gameState.lastKeys[key] <= -1){
        gameState.lastKeys[key] += 1;
        this.move(gameState.lastKeys[key], 3);
      }
      str += key +': ' + gameState.lastKeys[key] + ' ; ';
    }

    gameState.keysText.setText(str);

    if(Phaser.Input.Keyboard.JustDown(gameState.keysPlayer1.left)){
      //could I send this in as a pointer instead of an int value?
      gameState.lastKeys.left = this.specialMovementKeyVal(gameState.lastKeys.left);
    }
    if (Phaser.Input.Keyboard.JustDown(gameState.keysPlayer1.right)){
      gameState.lastKeys.right = this.specialMovementKeyVal(gameState.lastKeys.right);
    }
    if (Phaser.Input.Keyboard.JustDown(gameState.keysPlayer1.up)){
      gameState.lastKeys.up = this.specialMovementKeyVal(gameState.lastKeys.up);
    }
    if (Phaser.Input.Keyboard.JustDown(gameState.keysPlayer1.down)){
      gameState.lastKeys.down = this.specialMovementKeyVal(gameState.lastKeys.down);
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
