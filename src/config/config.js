
export default {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  //https://labs.phaser.io/view.html?src=src\physics\arcade\body%20controls.js
  physics: {
	    default: 'arcade',
	    arcade: {
	        debug: true
	    }
	}
};