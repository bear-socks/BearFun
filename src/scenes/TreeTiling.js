import Tile from "./Tile.js"
//constants
var CORN = 0;
var SIDE = 1;
var WEDGE = 2;
var SQU = 3;

//vars
var SCALE = 1;
var SIZE = 32 * SCALE;

//would need a scale variable to scale size with the image
//loading tiles
import t11111111 from './assets/TreeTiling/11111111.png';
import t00000111 from './assets/TreeTiling/00000111.png';
import t00011100 from './assets/TreeTiling/00011100.png';
import t01110000 from './assets/TreeTiling/01110000.png';
import t11000001 from './assets/TreeTiling/11000001.png';
import t11110000 from './assets/TreeTiling/11110000.png';
import t11100001 from './assets/TreeTiling/11100001.png';
import t11000011 from './assets/TreeTiling/11000011.png';
import t10000111 from './assets/TreeTiling/10000111.png';
import t00001111 from './assets/TreeTiling/00001111.png';
import t00011110 from './assets/TreeTiling/00011110.png';
import t00111100 from './assets/TreeTiling/00111100.png';
import t01111000 from './assets/TreeTiling/01111000.png';
import t11111000 from './assets/TreeTiling/11111000.png';
import t11110001 from './assets/TreeTiling/11110001.png';
import t11100011 from './assets/TreeTiling/11100011.png';
import t11000111 from './assets/TreeTiling/11000111.png';
import t10001111 from './assets/TreeTiling/10001111.png';
import t00011111 from './assets/TreeTiling/00011111.png';
import t00111110 from './assets/TreeTiling/00111110.png';
import t01111100 from './assets/TreeTiling/01111100.png';
import t11111100 from './assets/TreeTiling/11111100.png';
import t11111001 from './assets/TreeTiling/11111001.png';
import t11110011 from './assets/TreeTiling/11110011.png';
import t11100111 from './assets/TreeTiling/11100111.png';
import t11001111 from './assets/TreeTiling/11001111.png';
import t10011111 from './assets/TreeTiling/10011111.png';
import t00111111 from './assets/TreeTiling/00111111.png';
import t01111110 from './assets/TreeTiling/01111110.png';
import t11111110 from './assets/TreeTiling/11111110.png';
import t11111101 from './assets/TreeTiling/11111101.png';
import t11111011 from './assets/TreeTiling/11111011.png';
import t11110111 from './assets/TreeTiling/11110111.png';
import t11101111 from './assets/TreeTiling/11101111.png';
import t11011111 from './assets/TreeTiling/11011111.png';
import t10111111 from './assets/TreeTiling/10111111.png';
import t01111111 from './assets/TreeTiling/01111111.png';

export default class TreeTiling{
  constructor(scene, width, height){
    this.mainScene = scene;
    //an array
    this.tiles = [];
    //a dictionary
    //this.imgs = {};
    this.tileWidth = width / SIZE;
    this.tileHeight = height / SIZE;

    this.loadImages();
    this.generate();
  }

  loadImages(){

    this.mainScene.load.image('t11111111', t11111111);
    this.mainScene.load.image('t00000111', t00000111);
    this.mainScene.load.image('t00011100', t00011100);
    this.mainScene.load.image('t01110000', t01110000);
    this.mainScene.load.image('t11000001', t11000001);
    this.mainScene.load.image('t11110000', t11110000);
    this.mainScene.load.image('t11100001', t11100001);
    this.mainScene.load.image('t11000011', t11000011);
    this.mainScene.load.image('t10000111', t10000111);
    this.mainScene.load.image('t00001111', t00001111);
    this.mainScene.load.image('t00011110', t00011110);
    this.mainScene.load.image('t00111100', t00111100);
    this.mainScene.load.image('t01111000', t01111000);
    this.mainScene.load.image('t11111000', t11111000);
    this.mainScene.load.image('t11110001', t11110001);
    this.mainScene.load.image('t11100011', t11100011);
    this.mainScene.load.image('t11000111', t11000111);
    this.mainScene.load.image('t10001111', t10001111);
    this.mainScene.load.image('t00011111', t00011111);
    this.mainScene.load.image('t00111110', t00111110);
    this.mainScene.load.image('t01111100', t01111100);
    this.mainScene.load.image('t11111100', t11111100);
    this.mainScene.load.image('t11111001', t11111001);
    this.mainScene.load.image('t11110011', t11110011);
    this.mainScene.load.image('t11100111', t11100111);
    this.mainScene.load.image('t11001111', t11001111);
    this.mainScene.load.image('t10011111', t10011111);
    this.mainScene.load.image('t00111111', t00111111);
    this.mainScene.load.image('t01111110', t01111110);
    this.mainScene.load.image('t11111110', t11111110);
    this.mainScene.load.image('t11111101', t11111101);
    this.mainScene.load.image('t11111011', t11111011);
    this.mainScene.load.image('t11110111', t11110111);
    this.mainScene.load.image('t11101111', t11101111);
    this.mainScene.load.image('t11011111', t11011111);
    this.mainScene.load.image('t10111111', t10111111);
    this.mainScene.load.image('t01111111', t01111111);
  }

  generate(){
    this.genSquares();
    // //this.tiles[0] = new Tile(100, 50, SQU, this.mainScene);
    this.findSidesWedges();
    this.deleteSides();
    this.findCorners();
    this.genCorners();
    this.genSides();
    this.matchSides();
    this.matchWedges();
    this.matchCorners();
    this.fixUp();
    //remove tiles broken right now
    this.removeTiles();
    this.squareEdgesFix();
  }

  display(){

    for(var i = 0; i < this.tiles.length; i++){
      this.tiles[i].display(SCALE);
    }
    //this.mainScene.add.image(50, 50, 't11111111');
  }

  //THIS MIGHT NOT WORK ANYMORE BECAUSE IT CAN DISPLAY AN INVALID PICTURE
  isValidTile(t) {

    var num = 0;
    var lastIndex = -1;
    for(var i = 0; i < t.verts.length; i++){
      if(t.verts[i] == 1){
        num++;
        lastIndex = i;
      }
    }

    if(num == 3 && lastIndex % 2 == 0){
      return false;
    }
    else if(t.getCode() == "t10000011"){
      return false;
    }

    return true;
    // try {
    //   //may or may not work/mess things up
    //   t.display();
    // }
    // catch(err) {
    //   return false;
    // }
    // return true;
  }

  removeTiles() {

    for (var i = this.tiles.length - 1; i >= 0; i--) {
      var t = this.tiles[i];
      //println(imgs.get(t.getCode()));
      if (! this.isValidTile(t)) {
        //console.log(t.getCode());
        console.log("removed " + t.getCode());
        this.removeTile(t);
      }
    }
  }

  squareEdgesFix() {
    for (var i = 0; i < this.tiles.length; i++) {
      var t = this.tiles[i];
      if (t.hasSquare()) {
        t.fixSquare(this.getAdjTilesAll(t));
      }
    }
  }

  //returns adjacent tiles (square or non-square)
  //0 = left, 1 = right, 2 = top, 3 = bottom
  getAdjTilesAll(t) {
    var adjTiles = [null,null,null,null];

    for (var i = 0; i < this.tiles.length; i++) {
      var adjT = this.tiles[i];
      var num = 0;
      //print("r");
      for (var x = -SIZE + t.x; x <= SIZE + t.x; x += SIZE * 2) {
        //print("l");
        if (adjT.x == x && adjT.y == t.y) {
          adjTiles[num] = adjT;
          //print("yay1!");
        }
        num++;
      }
      for (var y = -SIZE + t.y; y <= SIZE + t.y; y += SIZE * 2) {
        if (adjT.y == y && adjT.x == t.x) {
          adjTiles[num] = adjT;
          //print("yay2!");
        }
        num++;
      }
    }
    return adjTiles;
  }

  //MAD UNNECCESSARY REPEATED CODE
//REWRITE WITH getAdjTilesAll
//returns adjacent tiles (non-square)
//0 = left, 1 = right, 2 = top, 3 = bottom
  getAdjTiles(t) {
    var adjTiles = [null, null, null, null];

    for (var i  = 0; i < this.tiles.length; i++) {
      var adjT = this.tiles[i];
      var num = 0;
      if (!adjT.isSquare()) {
        for (var x = -SIZE + t.x; x <= SIZE + t.x; x += SIZE * 2) {
          if (adjT.x == x && adjT.y == t.y) {
            adjTiles[num] = adjT;
          }
          num++;
        }
        for (var y = -SIZE + t.y; y <= SIZE + t.y; y += SIZE * 2) {
          if (adjT.y == y && adjT.x == t.x) {
            adjTiles[num] = adjT;
          }
          num++;
        }
      }
    }
    return adjTiles;
  }

//does null work?
  getAdjTilesWedge(t) {

    var temp = this.getAdjTilesAll(t);
    for (var i = temp.length - 1; i >= 0; i--) {
      var t2 = temp[i];
      if (t2 != null && t2.type != WEDGE) {
        temp[i] = null;
      }
    }
    return temp;
  }

//////////////////////MAIN GENERATE functions

//1
//can you += a js array?
  genSquares() {
  //0 = a full square

  var midWidth = Math.floor(this.tileWidth / 2);
  var midHeight = Math.floor(this.tileHeight / 2);

  console.log(this.tileWidth)
  for (var i = 6; i < this.tileWidth - 6; i++) {
    for (var j = midHeight; j < midHeight + 1; j += 1) {
      this.tiles.push(new Tile(i * SIZE, SIZE * j, SQU, this.mainScene));
    }
  }

  for (var i = midWidth; i < midWidth + 1; i++) {
    for (var j = 3; j < this.tileHeight - 3; j ++) {
      if(j != midHeight){
        this.tiles.push(new Tile(i * SIZE, SIZE * j, SQU, this.mainScene));
      }
    }
  }
}

//2
//find sides and wedges of the trees
  findSidesWedges() {
    for (var i = this.tiles.length - 1; i >= 0; i--) {
      var t = this.tiles[i];

      if (t.isSquare()) {
        for (var x = -SIZE; x <= SIZE; x += SIZE * 2) {
          var newX = t.x + x;
          if (!this.contains(newX, t.y)) {
            this.genTilePlace(newX, t.y);
          }
        }
        for (var y = -SIZE; y <= SIZE; y += SIZE * 2) {
          var newY = t.y + y;
          if (!this.contains(t.x, newY)) {
            this.genTilePlace(t.x, newY);
          }
        }
      }
    }
    this.updateWedges();
  }

  //3
  //delete sides that are adjacenet with squares on opposite sides
  //in the future could make these half sides
  //pvector STUFF COULD GET MESSED UPADFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
  deleteSides() {
    var dir;
    //println(tiles.size() - 1);
    for (var i = this.tiles.length - 1; i >= 0; i--) {
      //println(tiles.size());
      var side = this.tiles[i];
      if (this.sideOrWedge(side) == SIDE) {
        dir = this.getDirSquareOffSide(side);
        //going in the opposite direction of the square
        //need to set equals again? don't think so
        //println(dir.x, dir.y);
        dir.x *= -1;
        dir.y *= -1;
        //these should be ints anyway
        //println(dir.x, dir.y);
        var x = side.x + dir.x;
        var y = side.y + dir.y;
        if (this.containsSide(x, y)) {
          //println("yer");
          //go one more in this direction
          x += dir.x;
          y += dir.y;
          if (this.containsSquare(x, y)) {
            //remove both of these sides
            //println("yee");
            this.removeTile(side);
            this.removeTilePos(x - dir.x, y - dir.y);
            i--;
          }
        }
      }
    }
  }

  //4
  findCorners() {
    for (var i = this.tiles.length - 1; i >= 0; i--) {
      var s1 = this.tiles[i];
      if (this.isSideOrWedge(s1)) {
        for (var j = this.tiles.length - 1; j >= 0; j--) {
          var s2 = this.tiles[j];
          if (s2 != s1 && this.isSideOrWedge(s2)) {
            var x = (s1.x - s2.x);
            var y = (s1.y - s2.y);
            if (Math.abs(x) == Math.abs(y) && Math.abs(y) == SIZE) {
              //the tiles are diagonal from eachother
              //here, not sure what is going on
              var m = -1;
              var n = -1;
              if (! this.contains(s1.x, s2.y)) {
                m = s1.x;
                n = s2.y;
              } else if (! this.contains(s2.x, s1.y)) {
                m = s2.x;
                n = s1.y;
              }
              if (m != -1 || n != -1) {
                this.genCornerPlace(m, n);
              }
            }
          }
        }
      }
    }
  }

  //5
  //problems here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  genCorners() {
     for (var i = 0; i < this.tiles.length; i++) {
       var t = this.tiles[i];
       if (t.type == CORN) {
    //     //var dir = this.getDirOfCornSquare(t);
         var r = Math.random();
         //should we let corners be empty?
         if (r < 0) {
           //empty tile
           t.genVertsInit(-1);
         } else {
          //1 or 2
          //if you want to work every time
          // var left = this.random(2, 3);
          // var bot = this.random(2, 3);
           var left = this.random(1, 3);
           var bot = this.random(1, 3);
           //var left = 2;
           //var bot = 2;
           //left side
          for (var j = 2; j >= 2 - left; j -= 1) {
            t.verts[j] = 1;
          }
          //bottom side
          t.verts[3] = 1;
          if (bot == 2) {
            t.verts[4] = 1;
          }

          var dir = this.getDirOfCornSquare(t);
          this.rotateCorner(t, dir);
         }
       }
     }
  }

  //6
  genSides() {
    for (var i = 0; i < this.tiles.length; i++) {
      var t = this.tiles[i];
      if (t.type == SIDE) {
        var dir = this.getDirSquareOffSide(t);
        if (dir.x == SIZE) {
          //these should really be void methods
          t.genVertsInit(1);
        } else if (dir.x == -SIZE) {
          t.genVertsInit(2);
        } else if (dir.y == SIZE) {
          t.genVertsInit(3);
        } else if (dir.y == -SIZE) {
          t.genVertsInit(4);
        }
      }
    }
  }

  //7
  //match sides of sides to everything and nulls
  matchSides() {
    for (var i = 0; i < this.tiles.length; i++) {
      var t = this.tiles[i];
      if (t.type == SIDE) {
        var tileArr = this.getAdjTilesAll(t);
        t.matchNulls(tileArr);
        t.matchTile(tileArr, false);
      }
    }
  }

  //8
  matchWedges() {
    for (var i = 0; i < this.tiles.length; i++) {
      var t = this.tiles[i];
      if (t.type == WEDGE) {
        var tileArr = this.getAdjTilesAll(t);
        t.matchTile(tileArr, false);
      }
    }
  }

  //9
  //match corners to only wedges
  matchCorners() {
    for (var i = 0; i < this.tiles.length; i++) {
    var t = this.tiles[i];
      if (t.type == CORN || t.type == SIDE) {
        var tileArr = this.getAdjTilesWedge(t);
        t.matchTile(tileArr, true);
      }
    }
  }

//NEW helpers

  updateWedges() {
    for (var i = 0; i < this.tiles.length; i++) {
      var t = this.tiles[i];
      if (t.type == WEDGE) {
        var adjTiles = this.getAdjTilesAll(t);
        var val = true;
        for (var j = 0; j < adjTiles.length; j++) {
          var t2 = adjTiles[j];
          if (t2 == null || t2.type == WEDGE) {
            val = false;
            break;
          }
        }
        if (val) {
          t.genVertsInit(0);
          t.type = SQU;
          for (var j = 0; j < adjTiles.length; j++) {
            var t2 = this.tiles[j];
            if (t2.type == SIDE) {
              t2.type = WEDGE;
            }
          }
        }
      }
    }
  }

  genTilePlace(x, y) {
    var type = this.sideOrWedgePos(x, y);
    if (type != -1) {
      if (! this.contains(x, y)) {
        this.tiles.push(new Tile(x, y, type, this.mainScene));
      }
    }
  }

  genCornerPlace(x, y) {
    if (! this.contains(x, y)) {
      this.tiles.push(new Tile(x, y, CORN, this.mainScene));
    }
  }

  isSideOrWedge(t) {
    return t.type == SIDE || t.type == WEDGE;
  }

  sideOrWedge(t) {
    return this.sideOrWedgePos(t.x, t.y);
  }

  sideOrWedgePos(x1, y1) {
    var numX = 0;
    var numY = 0;
    for (var x = -SIZE; x <= SIZE; x += SIZE * 2) {
      var newX = x1 + x;
      if (this.containsSquare(newX, y1)) {
        numX++;
      }
    }
    for (var y = -SIZE; y <= SIZE; y += SIZE * 2) {
      var newY = y1 + y;
      if (this.containsSquare(x1, newY)) {
        numY++;
      }
    }
    //this should not be a tile
    if (numX == 2 || numY == 2) {
      return -1;
    }
    if (numX + numY == 1) {
      return SIDE;
    } else {
      return WEDGE;
    }
  }

  containsSide(x, y) {
    return this.sideOrWedgePos(x, y) == SIDE;
  }

  isSide(t) {
    return this.containsSide(t.x, t.y);
  }

  //this Tile should be a side
  //get the direction of the square of the side
  //DIRECTION STUFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF and the method below GetDirOfCornSquare
  getDirSquareOffSide(side) {
    //think this should work
    var temp = {};

    var x1 = side.x;
    var y1 = side.y;

    for (var x = -SIZE; x <= SIZE; x += SIZE * 2) {
      var newX = x1 + x;
      if (this.containsSquare(newX, y1)) {
        temp.x = newX - x1;
        temp.y = 0;
        return temp;
      }
    }
    for (var y = -SIZE; y <= SIZE; y += SIZE * 2) {
      var newY = y1 + y;
      if (this.containsSquare(x1, newY)) {
        temp.x = 0;
        temp.y = newY - y1;
        return temp;
      }
    }
    return temp;
  }

  //get the direction of a square off the corner
  getDirOfCornSquare(t) {
    if (t.type != CORN) {
      console.log("tile is not a corner, error");
    }
    for (var x = -SIZE; x <= SIZE; x += SIZE * 2) {
      for (var y = -SIZE; y <= SIZE; y += SIZE * 2) {
        if (this.containsSquare(x + t.x, y + t.y)) {
          //var temp = {};
          var temp = new Object();
          temp.x = x;
          temp.y = y;
          //console.log("here!");
          return temp;
        }
      }
    }
    console.log("no square diaganol from corner, returned null!");
    // var temp = new Object();
    // temp.x = 0;
    // temp.y = 0;
    //return temp;
    return null;
  }

  //probs here
  rotateCorner(t, dir) {
    //println(dir.heading());
    //float rot = dir.heading() + 7 * PI / 4;
    //rot /= PI / 2;
    //rot += 2;
    //t.verts = t.rotation(t.verts, (int) rot);

    //println(a);
    //println(PI / 4);
    //PI / 4 has an extra decimal place for some reason
    if(dir != null){
      if (dir.x == SIZE && dir.y == SIZE) {
        //print("yeah");
        t.rotation(2);
      }
      if (dir.x == -SIZE && dir.y == SIZE) {
        t.rotation(0);
      }
      if (dir.x == -SIZE && dir.y == -SIZE) {
        t.rotation(6);
      }
      if (dir.x == SIZE && dir.y == -SIZE) {
        t.rotation(4);
      }
    }
    else{
      //this.removeTile(t);
    }
  }

  removeTile(t) {

    for (var i = this.tiles.length - 1; i >= 0; i--){
     if (this.tiles[i] === t) {
       this.tiles.splice(i, 1);
     }
    }
  }

  removeTilePos(x, y) {
    for (var i = this.tiles.size() - 1; i >= 0; i--) {
      var t = this.tiles[i];
      if (t.x == x && t.y == y) {
        this.tiles.splice(i, 1);
      }
    }
  }

  containsSquare(x, y) {
    for (var i = 0; i < this.tiles.length; i++) {
      var t = this.tiles[i];
      if (t.isSquare()) {
        if (t.x == x && t.y == y) {
          return true;
        }
      }
    }
    return false;
  }

  contains(x, y) {
    for (var i = 0; i < this.tiles.length; i++) {
      var t = this.tiles[i];
      if (t.x == x && t.y == y) {
        return true;
      }
    }
    return false;
  }

  fixUp() {
    for (var i = 0; i < this.tiles.length; i++) {
      var t = this.tiles[i];
      if (t.type == SIDE || t.type == WEDGE) {
        for (var j = 0; j < t.verts.length; j++) {
          var num = t.verts[j];
          if (num == 0 && t.verts[(j + 7) % 8] == 1 && t.verts[(j + 1) % 8] == 1) {
            t.verts[j] = 1;
          }
        }
      }
    }
  }

  random(num1, num2){
    num2 -= num1;
    return Math.floor((Math.random() * num2) + num1);
  }
}
