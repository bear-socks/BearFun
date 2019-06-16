export default class Turret{

  constructor(player, tilingMatrix = [[]]){
    this.posX = player.x;
    this.posY = player.y;
    this.player = player;
    this.bullets = 30;
    this.FOV = tilingMatrix;

  }

  update(oppPos){
    //within range
    if (abs(oppPos[0] - this.posX) <= 75 && abs(oppPos[1] - this.posY) <= 75){
      //if not hiding under trees
      if (this.FOV[oppPos[0]][oppPos[1]]){
        this.fire();
      }
    }
  }



}
