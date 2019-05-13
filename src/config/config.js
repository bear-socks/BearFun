
export default {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1200,
  height: 800,
  //https://labs.phaser.io/view.html?src=src\physics\arcade\body%20controls.js
  physics: {
	    default: 'arcade',
	    arcade: {
          //gravity: {y: 0},
	        debug: true
	    }
	},
  backgroundColor: "#320193",
  pixelArt: true
};