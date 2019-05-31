//further plans
// implement bases into this class
// and animations for both players and the bases

//IMPORTANT
// to call a function from this class, call the player
// object that you created with it .functions. the function
// for example:
//   player1 = new Player(player1);
//   player1.functions.move();

//this variables get imoprted with the player class
//should be 200 when not testing
var SPEED = 500;

var LEFT = 0;
var RIGHT = 1;

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
    player.speed = SPEED;
    player.respawnCounter = 0;

    //worm stuff
    player.wormCount = 0;
    player.berserk = -1;

    //these are for animation
    player.directionX = 0;
    player.movingY = false;

    //the movementAnimations for a player
    player.animArr = [];

    //must assign this though
    //player.body;
    player.scoreText;
    player.textPos = [];

    //stuff we need could implement but might be hard
    player.lastKeys = {};
    //the names of the keys
    player.keys = Object.keys(keys);
    //the actual values of the keys
    player.directKeys = Object.values(keys);
    //keeps a pointer to this actual object
    player.functions = this;

    player.base;

    player.setCollideWorldBounds(true);
    player.setScale(player.scale);
    player.setBounce(player.bounce);
    //console.log('made a new player  / dashing :' + player.isDashing);

    //but returns the original parameter
    return player;
  }

  updatePlayer(){
    //if reset is -1, player is alive
    // console.log(gameState.player1.respawnCounter);
    // console.log(gameState.player2.respawnCounter);
    if (this.player.respawnCounter == -1){
      this.player.setVelocity(0);
      if(this.player.coolDown == 0){
        //period or q
        if (this.player.directKeys[4].isDown){
          this.wormAction();
        }
        else {
          this.movement();
        }
      }
      else{
        this.player.coolDown -= 1;
      }

      //ending berserk mode
      if (this.player.berserk > 0){
        this.player.berserk -= 1;
      }
      //resets from berserk mode
      else if (this.player.berserk == 0){
        this.player.berserk = -1;
        this.player.setScale(1);
        this.player.speed = SPEED;
        this.player.hasPriority = false;
      }
    }
    else if (this.player.respawnCounter == 0){
      this.player.respawnCounter = -1;
      this.player.functions.respawn();
    }
    else{
      this.player.respawnCounter -= 1;
    }
  }

  movement(){
    var keyArr = []
    if (! this.player.isDashing){
      for(var i = 0; i <= 3; i++){
        if (this.player.directKeys[i].isDown) {
          keyArr[i] = i;
        }
      }
      this.move(keyArr, 1);
    }
    this.specialMovement();
    this.animatePlayer();
  }

  move(keyArr, multiplier){
    //this.add.text(600, 600, key);
    var x = 0;
    var y = 0;
    for(var i = 0; i < keyArr.length; i++){
      var val = keyArr[i];
      if(val == 0){y -= 1;}
      if(val == 1){y += 1;}
      if(val == 2){x -= 1;}
      if(val == 3){x += 1;}
    }
    if(x != 0){
      this.player.setVelocityX(this.player.speed * multiplier * x);
    }
    if(y != 0){
      this.player.setVelocityY(this.player.speed * multiplier * y);
    }
  }

  specialMovementCheck(){
    for(var i = 0; i <= 3; i++){
      if(Phaser.Input.Keyboard.JustDown(this.player.directKeys[i])){
        this.player.lastKeys[i] = this.specialMovementKeyVal(this.player.lastKeys[i]);
      }
    }
  }

  specialMovementKeyVal(key){
    if(key > 0){
      console.log('dash');
      //gameState.player1.setVelocityX(-2400);
      return -15;
    }
    else{
      return 12;

    }
  }

  //lKeys is a lastKeys object
  specialMovement(){
    if (! this.player.isDashing){
      this.specialMovementCheck();
    }
    let str = '';
    var dashingVar = false;
    for (var i = 0; i <= 3; i++){
      //not dashing
      if (this.player.lastKeys[i] >= 1) {
        this.player.lastKeys[i] -= 1;
      }
      //dashing
      else if(this.player.lastKeys[i] <= -1){
        //console.log(key);
        this.move([i], 3);
        dashingVar = true;
        if(this.player.lastKeys[i] == -1){
          dashingVar = false;
          if (this.player.berserk < 0){
            this.setCoolDown();
          }
        }
        this.player.lastKeys[i] += 1;
      }
      str += i +': ' + this.player.lastKeys[i] + ' ; ';
    }
    //console.log(str);
    this.player.isDashing = dashingVar;
  }

  animatePlayer(){
    this.player.movingY = false;
    //console.log(this.player.animArr.length);

    //only if this player has animations
    if(this.player.animArr.length == 4){
      if (this.player.directKeys[0].isDown)
      {
        this.player.anims.play(this.player.animArr[this.player.directionX], true);
        this.player.movingY = true;
      }
      else if (this.player.directKeys[1].isDown)
      {
        this.player.anims.play(this.player.animArr[this.player.directionX], true);
        this.player.movingY = true;
      }
      if (this.player.directKeys[2].isDown)
      {
        this.player.anims.play(this.player.animArr[LEFT], true);
        this.player.directionX = LEFT;
      }
      else if (this.player.directKeys[3].isDown)
      {
        this.player.anims.play(this.player.animArr[RIGHT], true);
        this.player.directionX = RIGHT;
      }
      else if (!this.player.movingY){
        //can't tell if something weird is going on with movement but if it is then it is here
        this.player.anims.play(this.player.animArr[this.player.directionX + 2], true);
      }
    }
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
    this.addScore(1);
    if(otherPlayer.wormCount > 0){
      otherPlayer.functions.addWorms(-1);
    }

    //something weird was going on with this line below
    otherPlayer.respawnCounter = 100;
    otherPlayer.setVelocity(0);
    otherPlayer.disableInteractive();
    otherPlayer.setCollideWorldBounds(false);
    //could cause a problem with both characters dying at the same time and going to the same position
    //so put in the random initX value
    otherPlayer.setPosition(-1000, this.initX);

    otherPlayer.functions.setBaseOpen(true);
    this.setBaseOpen(false);
  }

  addScore(num){
    this.player.score += num;
    this.player.scoreText.setText(`${this.player.score}`);
    this.recenterText();
    //gameState.player2.scoreText.setPosition(100 + (gameState.player2.scoreText.width / 2) , 100);
  }

  addWorms(num){
    this.player.wormCount += num;
    this.player.wormText.setText(`${this.player.wormCount}`);
    this.recenterText();
  }

  setBaseOpen(b){
    this.player.base.setOpen(b);
  }

//Power ups from the worms
//Currently only berserk mode
  wormAction(){
    console.log(this.player.berserk);
    if (this.player.wormCount >= 3 && this.player.berserk == -1){
        this.berserk();
    }
  }

//Gets big and fast
  berserk(){
    this.addWorms(-3);
    this.player.setScale(2);
    this.player.speed = SPEED * 1.5;
    this.player.berserk = 180;
    this.player.hasPriority = true;
  }

  initText(x2, y2){
    this.player.textPos.x = x2;
    this.player.textPos.y = y2;
    this.recenterText();
     //score goes in front of players
     this.player.scoreText.setDepth(3);
     this.player.wormText.setDepth(1);
  }

  recenterText(){
    this.player.scoreText.setPosition(this.player.textPos.x - (this.player.scoreText.width / 2) , this.player.textPos.y);
    this.player.wormText.setPosition(this.player.textPos.x - (this.player.wormText.width / 2) , this.player.textPos.y + 50);
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
