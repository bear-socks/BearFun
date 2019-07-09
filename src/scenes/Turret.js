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
    this.warmedUp = 0;
    //turret.functions = this;

  }

  changeMatrix(newMatrix){
    this.FOV = newMatrix;
  }


  update(oppPos, gameState){
    var resizedOpp = [Math.round(oppPos[0] / (SIZE * SCALE)), Math.round(oppPos[1] / (SIZE * SCALE))];
    //within range
    var distanceToOpp = [(resizedOpp[0] - this.posX), (resizedOpp[1] - this.posY)];
    //console.log('angle' + this.turret.angle);
    if (Math.hypot(distanceToOpp[0], distanceToOpp[1]) <= 8){
      //if not hiding under trees
      if (!this.FOV[resizedOpp[0]][resizedOpp[1]]){
        //where turret fires
        if (this.warmedUp >= 10) {console.log('firing');

        }
        else {this.warmedUp +=1; console.log('warming up');}

        var target = ((-1 * (Math.atan2(distanceToOpp[0], distanceToOpp [1]) * 180 / Math.PI)) + 360) % 360;
        var current = (this.turret.angle + 360) % 360;
        var between = target - current;

        //turns towards other player
        if (between > 0){
          if (Math.abs(between) <= 180) {this.turret.angle += 4;}
          else {this.turret.angle -= 4;}
        }
        else if (between < 0){
          if (Math.abs(between) <= 180) {this.turret.angle -= 4;}
          else {this.turret.angle += 4;}
        }
      }
      else{
        console.log('hidden');
        if (this.warmedUp > 0) { this.warmedUp -= 2;}
      }
    }
    else{console.log('not firing')
      if (this.warmedUp > 0) { this.warmedUp -= 2;}
    }
  }
}
