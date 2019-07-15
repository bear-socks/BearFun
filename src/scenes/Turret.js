//should be same as treeTiling
var SIZE = 32;
var SCALE = 1;

export default class Turret{


  constructor(turret, player, color, tilingMatrix = [[]]){
    this.realX = player.x;
    this.realY = player.y;
    this.posX = Math.round(player.x / (SIZE * SCALE));
    this.posY = Math.round(player.y / (SIZE * SCALE));
    this.turret = turret;
    this.player = player;
    this.bullets = 30;
    this.FOV = tilingMatrix;
    this.warmedUp = 0;
    this.color = color;
    //turret.functions = this;


  }

  changeMatrix(newMatrix){
    this.FOV = newMatrix;
  }


  update(oppPos, gameState){

    //gives angle of the turret to gameState, which is used for firing bullers
    if (this.color == 'blue') { gameState.blueTurretAngle = this.turret.angle * Math.PI / 180; }
    else { gameState.redTurretAngle = this.turret.angle * Math.PI / 180 }

    //converts pixel coordinates to to tile coordinates
    var resizedOpp = [Math.round(oppPos[0] / (SIZE * SCALE)), Math.round(oppPos[1] / (SIZE * SCALE))];

    //within range
    var distanceToOpp = [(resizedOpp[0] - this.posX), (resizedOpp[1] - this.posY)];
    if (Math.hypot(distanceToOpp[0], distanceToOpp[1]) <= 8){

      //if not hiding under trees
      if (!this.FOV[resizedOpp[0]][resizedOpp[1]]){
        this.warmedUp +=1;

        var target = ((-1 * (Math.atan2(distanceToOpp[0], distanceToOpp [1]) * 180 / Math.PI)) + 360) % 360;
        var current = (this.turret.angle + 360) % 360;
        var between = target - current;
        console.log(target, current);

        //turns towards other player
        if (between > 0){
          if (Math.abs(between) <= 180) { this.turret.angle += Math.min(5, Math.abs(between)); }
          else { this.turret.angle -= Math.min(5, Math.abs(between)); }
        }
        else if (between < 0){
          if (Math.abs(between) <= 180) { this.turret.angle -= Math.min(5, Math.abs(between)); }
          else { this.turret.angle += Math.min(5, Math.abs(between)); }
        }
      }
      else{
      //  console.log('hidden');
        if (this.warmedUp > 0) { this.warmedUp -= 1;}
      }
    }
    else{//console.log('not firing')
      if (this.warmedUp > 0) { this.warmedUp -= 1;}
    }
  }
}
