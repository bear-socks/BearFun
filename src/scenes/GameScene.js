import 'phaser';

//i've seen better ways to do this but can't figure it out
import logoImg from './assets/logo.png';
import birdImg from './assets/bird.png';
import treeImg from './assets/tree.png';
import crateImg from './assets/crate.png';

//loading sound is not working, not sure why
//import skyMall from './assets/skyMall.mp3';

//this is used to avoid having to making global variables for everything
//that we need to pass between the preload create and update functions
const gameState = {};

// var keysPlayer1;
//var keysPlayer2;
//var player1;
//var player2;

  function createWorld(){
    this.add.text(50, 50, 'will ke poop');
  }

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
 		this.load.image('bird', birdImg);
    this.load.image('crate', crateImg);
    this.load.image('tree', treeImg);

    //this.load.audio('theme', skyMall);

	}


  create(){

    //load music
    //.wav file did not work for this, think I need something more in the package for that
    //gameState.music = this.sound.add('theme');
    //gameState.music.play();

    //adding text
    this.add.text(50, 50, 'will like poop');

    this.createWorld();

    this.createPlayer();

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
    // gameState.platforms = this.physics.add.staticGroup();
    // gameState.platforms.create(400, 568, 'crate').refreshBody();

    gameState.platforms = this.physics.add.group();
    gameState.platforms.create(400, 568, 'crate').setCollideWorldBounds(true);
  }

  createPlayer(){

    gameState.players = this.physics.add.group();

    //combine these into one or no?, might mess things up if I do
    //player 1 keys
    gameState.keysPlayer1 = this.input.keyboard.createCursorKeys();
    //player 2 keys
    gameState.keysPlayer2 = this.input.keyboard.addKeys('W,A,S,D');

    //const logo = this.add.image(400, 150, 'logo');
    //const bird = this.add.image(200, 450, 'bird');

    gameState.player1 = this.physics.add.image(600, 300, 'bird');
    gameState.player1.setScale(.5);
    gameState.player1.setCollideWorldBounds(true);
    //this.physics.add.collider(gameState.player1, gameState.platforms);

    gameState.player2 = this.physics.add.sprite(150, 300, 'logo');
    gameState.player2.setCollideWorldBounds(true);
    gameState.player2.setScale(.4);

    gameState.players.add(gameState.player1);
    gameState.players.add(gameState.player2);

    this.physics.add.collider(gameState.players, gameState.platforms);
    this.physics.add.collider(gameState.players, gameState.players);
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
  }

}

