//should be same as treeTiling
var SIZE = 32;
var SCALE = 1;

export default class Turret{


  constructor(turret, player, tilingMatrix = [[]]){
    this.posX = Math.round(player.x / (SIZE * SCALE));
    this.posY = Math.round(player.y / (SIZE * SCALE));
    this.turret = turret;
    this.player = player;
    this.bullets = 30;
    this.FOV = tilingMatrix;
    //turret.functions = this;

  }

  changeMatrix(newMatrix){
    this.FOV = newMatrix;
  }

  update(oppPos = []){
    var resizedOpp = [Math.round(oppPos[0] / (SIZE * SCALE)), Math.round(oppPos[1] / (SIZE * SCALE))];
    //within range
    if (Math.hypot((resizedOpp[0] - this.posX), (resizedOpp[1] - this.posY)) <= 8){
      //if not hiding under trees
      if (!this.FOV[resizedOpp[0]][resizedOpp[1]]){
        console.log('firing');
      //  this.fire();
      }
      else{console.log('hidden')}
    }
    else{console.log('not firing')}
  }





}
