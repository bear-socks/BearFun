import Phaser from "phaser";

//import pictures
// import logoImg from "./assets/logo.png";
// import birdImg from "./assets/bird.png";

//using the default exports
import config from "./config/config"
import GameScene from "./scenes/GameScene"

class Game extends Phaser.Game{
  constructor(){
    //using the imported config up top
    super(config);
    //GameScene imported up top
    this.scene.add('Game', GameScene);
    this.scene.start('Game');
  }
}

window.onload = function(){
  window.game = new Game();
}