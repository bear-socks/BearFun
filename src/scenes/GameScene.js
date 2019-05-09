import 'phaser';

//i've seen better ways to do this but can't figure it out
import logoImg from './assets/logo.png';
import birdImg from './assets/bird.png';
import treeImg from './assets/tree.png';
import crateImg from './assets/crate.png';


var keysPlayer1;
var keysPlayer2;
var player1;
var player2;

export default class GameScene extends Phaser.Scene {
	//calling the super constructor
	constructor(){
		super('Game')
	}

	preload(){
		this.load.image('logo', logoImg);
 		this.load.image('bird', birdImg);
    this.load.image('crate', crateImg);
    this.load.image('tree', treeImg);
	}

	create(){

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

    //combine these into one or no?, might mess things up if I do
    //player 1 keys
    keysPlayer1 = this.input.keyboard.createCursorKeys();
    //player 2 keys
    keysPlayer2 = this.input.keyboard.addKeys('W,A,S,D');

		//const logo = this.add.image(400, 150, 'logo');
    //const bird = this.add.image(200, 450, 'bird');

    player1 = this.physics.add.image(600, 300, 'bird');
    player1.setScale(.5);
    player1.setCollideWorldBounds(true);

    player2 = this.physics.add.image(150, 300, 'logo');
    player2.setScale(.4);
    player2.setCollideWorldBounds(true);
	}

  update (){
    //player1 movement
    player1.setVelocity(0);

    if (keysPlayer1.left.isDown)
    {
        player1.setVelocityX(-300);
    }
    else if (keysPlayer1.right.isDown)
    {
        player1.setVelocityX(300);
    }

    if (keysPlayer1.up.isDown)
    {
        player1.setVelocityY(-300);
    }
    else if (keysPlayer1.down.isDown)
    {
        player1.setVelocityY(300);
    }

    //player2 movement
    player2.setVelocity(0);

    if (keysPlayer2.A.isDown)
    {
        player2.setVelocityX(-300);
    }
    else if (keysPlayer2.D.isDown)
    {
        player2.setVelocityX(300);
    }

    if (keysPlayer2.W.isDown)
    {
        player2.setVelocityY(-300);
    }
    else if (keysPlayer2.S.isDown)
    {
        player2.setVelocityY(300);
    }
  }

}


  // this.tweens.add({
  //   targets: logo,
  //   y: 450,
  //   duration: 2000,
  //   ease: "Power2",
  //   yoyo: true,
  //   loop: -1
  // });

  // scene: {
  //   preload: preload,
  //   create: create
  // }