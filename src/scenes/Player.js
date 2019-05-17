
//IMPORTANT
// to call a function from this class, call the player
// object that you created with it .functions. the function
// for example:
//   player1 = new Player(player1);
//   player1.functions.move();

//ADD IN A PLAYERS BASE
const speed = 200;

//could maybe extend a Phaser.body object to be more simple
export default class Player{
  //player is the sprite body
  constructor(player, keys){
    this.initX = player.x;
    this.initY = player.y;
    this.player = player;
    player.isDashing = false;
    player.score = 0;
    player.scale = 1;
    player.bounce = .2;
    player.coolDown = 0;
    player.speed = speed;
    player.respawnCounter = 0;
    //not sure about these two
    player.directionX = 'Left';
    player.movingY = false;

    //must assign this though
    //player.body;
    player.scoreText;

    //stuff we need could implement but might be hard
    player.lastKeys = {};
    player.keys = Object.keys(keys);
    //keeps a pointer to this actual object
    player.functions = this;

    player.setCollideWorldBounds(true);
    player.setScale(player.scale);
    player.setBounce(player.bounce);
    console.log('made a new player  / dashing :' + player.isDashing);

    //but returns the original parameter
    return player;
  }

  //I think this is where the dashing problem is
  move(key, multiplier){
    //key is a number instead of a pointer which is the problem
    //this.add.text(600, 600, key);
    if(key == this.player.keys[2]){
      this.player.setVelocityX(-this.player.speed * multiplier);
    }
    if(key == this.player.keys[3]){
      this.player.setVelocityX(this.player.speed * multiplier);
    }
    if(key == this.player.keys[0]){
      this.player.setVelocityY(-this.player.speed * multiplier);
    }
    if(key == this.player.keys[1]){
      this.player.setVelocityY(this.player.speed * multiplier);
    }
  }

  specialMovementCheck(){
    if(Phaser.Input.Keyboard.JustDown(this.player.keys[0])){
      //could I send this in as a pointer instead of an int value?
      this.player.lastKeys[0] = specialMovementKeyVal(this.player.lastKeys[0]);
    }
    if (Phaser.Input.Keyboard.JustDown(gameState.keysPlayer2.D)){
      gameState.player2.lastKeys.D = specialMovementKeyVal(gameState.player2.lastKeys.D);
    }
    if (Phaser.Input.Keyboard.JustDown(gameState.keysPlayer2.W)){
      gameState.player2.lastKeys.W = specialMovementKeyVal(gameState.player2.lastKeys.W);
    }
    if (Phaser.Input.Keyboard.JustDown(gameState.keysPlayer2.S)){
      gameState.player2.lastKeys.S = specialMovementKeyVal(gameState.player2.lastKeys.S);
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


  specialMovement(){

  }

  setCoolDown(){
    this.player.coolDown = 30;
  }

  respawn(){
    this.player.lastKeys = {};
    this.player.setPosition(this.initX, this.initY);
    this.player.setCollideWorldBounds(true);
  }

  kill(otherPlayer){
    //stops the dashing
    this.player.lastKeys = {};
    this.player.score += 1;
    this.player.scoreText.setText(`${this.player.score}`);

    //something weird was going on with this line below
    otherPlayer.respawnCounter = 100;
    otherPlayer.setVelocity(0);
    otherPlayer.disableInteractive();
    otherPlayer.setCollideWorldBounds(false);
    //could cause a problem with both characters dying at the same time and going to the same position
    //so put in the random initX value
    otherPlayer.setPosition(-1000, this.initX);
  }

  poop(){
    console.log(this.player.keys);

    this.player.keys.forEach(function(key,index) {
    // key: the name of the object key
    // index: the ordinal position of the key within the object
      console.log(index + ' ' + key)
    });

    console.log(this.player.keys[1]);
  }

}
