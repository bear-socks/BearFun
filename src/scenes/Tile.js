var CORN = 0;
var SIDE = 1;
var WEDGE = 2;
var SQU = 3;

export default class Tile{
  constructor(x, y, type, mainScene){
    this.x = x;
    this.y = y;
    //collection of 8 points to represent if each point is connected or not
    this.verts = [0,0,0,0,0,0,0,0];
    this.mainScene = mainScene;
    this.nextDiag = false;
    this.type = type;
    console.log(this.type);
    if (this.type == SQU) {
      this.genVertsInit(0);
    } else {
      //an empty placeholder for now
      this.genVertsInit(-1);
    }
  }

  //made this a void instead of return CHECK HERE FOR BUGS
  genVertsInit(r) {
    if (r == -1) {
      //no verticies
      this.genVerts(0, -100);
    }
    //square
    else if (r == 0) {

      this.genVerts(0, 7);
    } else {
      var add = this.random(1, 3);
      var add2 = this.random(0, 2);
      if (add == add2) {
        //add += 1;
      }
      if (Math.random() < .5) {
        this.genVerts(4-add2, 6 + add);
      } else {
        this.genVerts(4 - add, 6 + add2 );
      }
      //right side whole
      if (r == 1) {
      }
      //left side whole
      else if (r == 2) {
        this.rotation(4);
      }
      //bottom side whole
      else if (r == 3) {
        this.rotation(6);
      }
      //top side whole
      else if (r == 4) {
        this.rotation(2);
      }
    }
  }

  genVerts(start, finish) {
    this.verts = [0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = start; i <= finish; i++) {
      this.verts[i % 8] = 1;
    }
  }

  //WE DON'T USE VERTS HERE
  rotation(r) {
    var nVert = [0,0,0,0,0,0,0,0];
    for (var i = r + this.verts.length; i < r + this.verts.length * 2; i++) {
      nVert[i % nVert.length] = this.verts[(i - r) % nVert.length];
    }
    this.verts = nVert;
  }

  isSquare() {
    return this.type == SQU;
  }

  hasSquare() {
    for (var i = 0; i <= this.verts.length; i++) {
      var n = this.verts[i];
      //print(n);
      if (n == 0) {
        return false;
      }
    }
    return true;
  }

  matchTile(tileArr, canWedge) {
    for (var i = 0; i < 4; i++) {
      var adjT = tileArr[i];
      if (adjT != null && (canWedge || adjT.type != WEDGE)) {
        //not sure about i == 0
        if (i == 0) {
          //matching up this particular side
          for (var n = 4; n <= 6; n++) {
            this.verts[6 - n % 8] = adjT.verts[n % 8];
          }
        }
        if (i == 1) {
          for (var n = 4; n <= 6; n++) {
            this.verts[n] = adjT.verts[6 - n % 8];
          }
        }
        if (i == 2) {
          for (var n = 6; n <= 8; n++) {
            this.verts[n % 8] = adjT.verts[(10 - n) % 8];
          }
        }
        if (i == 3) {
          for (var n = 6; n <= 8; n++) {
            this.verts[(10 - n) % 8] = adjT.verts[n % 8];
          }
        }
      }
    }
  }

  //erase vertices next to empty tiles
  //can greatly simplify this code
  matchNulls(tileArr) {
    for (var i = 0; i < 4; i++) {
      var adjT = tileArr[i];
      if (adjT == null || adjT.type == WEDGE) {
        //not sure about i == 0
        if (i == 0) {
          //matching up this particular side
          for (var n = 5; n <= 5; n++) {
            this.verts[6 - n % 8] = 0;
          }
        }
        if (i == 1) {
          for (var n = 5; n <= 5; n++) {
            this.verts[n] = 0;
          }
        }
        if (i == 2) {
          for (var n = 7; n <= 7; n++) {
            this.verts[n % 8] = 0;
          }
        }
        if (i == 3) {
          for (var n = 7; n <= 7; n++) {
            this.verts[(10 - n) % 8] = 0;
          }
        }
      }
    }
    this.removeIsolatedVertices();
  }

  removeIsolatedVertices() {
    for (var i = 0; i < 8; i++) {
      var last = this.verts[(i + 8 -1) % 8];
      var next = this.verts[(i + 1) % 8];
      if (last == 0 && next == 0) {
        this.verts[i] = 0;
      }
    }
  }

  fixSquare(adjT) {
    for (var i = 0; i < adjT.length; i++) {
      if (adjT[i] == null) {
        //if (index != -1) {
        //  println("ERROR FIXSQUARE");
        //}
        this.removeSideIndex(i);
        return;
      }
    }
    //removeIsolatedVertices();
  }

  removeSideIndex(index) {
    //converting to the vertex coordinate
    //console.log("index" +  index);
    if (index != -1) {
      if (index == 0) {
        index = 1;
      } else if (index == 1) {
        index = 5;
      } else if (index == 2) {
        index = 7;
      }
      //index = 3 both times
      this.verts[index] = 0;
    }
  }

  eraseVerts(one, two) {
    verts[one] = -1;
    verts[two] = -1;
  }

  getCode() {
    var str = "";
    for (var i = 0; i < this.verts.length; i++) {
      str += this.verts[i];
    }
    return "t" + str;
  }

  display(SCALE){
    var str = this.getCode();
    //console.log(str);
    this.pic = this.mainScene.add.image(this.x + 16, this.y + 16, str).setDepth(2).setScale(SCALE);
  }

  stopDisplay(SCALE){
    //var str = this.getCode();
    //console.log(str);
    this.pic.destroy();
  }

  //returns a randomInt between the two numbers
  //upper bound exclusive
  random(num1, num2){
    num2 -= num1;
    return Math.floor((Math.random() * num2) + num1);
  }
}
