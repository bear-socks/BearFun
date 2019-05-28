ArrayList<Tile> tiles;
int SIZE = 32;


//can be a regular array
HashMap<String, PImage> imgs = new HashMap<String, PImage>();

void setup() {
  size(640, 640);

  tiles = new ArrayList<Tile>();

  loadImages();
  
  genSquares();
  generate();
  
}

void generate(){
  findSidesWedges();
  deleteSides();
  findCorners();
  genCorners();
  genSides();
  matchSides();
  matchWedges();
  matchCorners();
  fixUp();
  removeTiles();
  squareEdgesFix();
}

void loadImages() {
  //8
  addImg("11111111");
  //3's special case
  addImg("00000111");
  addImg("00011100");
  addImg("01110000");
  addImg("11000001");

  //go through every position with four to 8 ones
  for (int numOnes = 4; numOnes <= 7; numOnes++) {
    String str = "";
    for (int i = 0; i < numOnes; i++) {
      str += "1";
    }
    for (int i = numOnes; i < 8; i++) {
      str += "0";
    }
    //rotate through all possibilities
    for (int i = 0; i < 8; i++) {
      addImg(str);
      str = rotateForward(str);
    }
  }
}

void addImg(String str) {
  imgs.put(str, loadImage(str + ".png"));
  //println("import " + str + " from './assets/TreeTiling/" + str + "';");
  //println("this.load.image('" + str + "', " + str + ");");
}

void draw() {
  background(255);
  for (Tile t : tiles) {
    t.display();
  }
}

String rotateForward(String str) {
  String newStr = "";
  for (int i = 1; i <= str.length(); i++) {
    newStr += str.charAt(i % str.length());
  }
  return newStr;
}

boolean isValidTile(Tile t) {
  try {
    image(imgs.get(t.getCode()), -100, 0);
  }
  catch(Exception e) {
    return false;
  }
  return true;
}

void removeTiles() {
  //fixing the tiles up for binary conversion
  for (int i = tiles.size() - 1; i >= 0; i--) {
    Tile t = tiles.get(i);
    //println(imgs.get(t.getCode()));
    if (!isValidTile(t)) {
      println(t.getCode()); 
      tiles.remove(t);
    }
  }
}

void squareEdgesFix() {
  for (Tile t : tiles) {
    if (t.hasSquare()) {
      t.fixSquare(getAdjTilesAll(t));
    }
  }
}

//returns adjacent tiles (square or non-square)
//0 = left, 1 = right, 2 = top, 3 = bottom
Tile[] getAdjTilesAll(Tile t) {
  Tile[] adjTiles = new Tile[4];

  for (Tile adjT : tiles) {
    int num = 0;
    //print("r");
    for (float x = -SIZE + t.x; x <= SIZE + t.x; x += SIZE * 2) {
      //print("l");
      if (adjT.x == x && adjT.y == t.y) {
        adjTiles[num] = adjT;
        //print("yay1!");
      }
      num++;
    }
    for (float y = -SIZE + t.y; y <= SIZE + t.y; y += SIZE * 2) {
      if (adjT.y == y && adjT.x == t.x) {
        adjTiles[num] = adjT;
        //print("yay2!");
      }
      num++;
    }
  }
  return adjTiles;
}

Tile[] getAdjTilesWedge(Tile t) {
  Tile[] temp = getAdjTilesAll(t);

  for (int i = temp.length - 1; i >= 0; i--) {
    Tile t2 = temp[i];
    if (t2!= null && t2.type != WEDGE) {
      temp[i] = null;
    }
  }

  return temp;
}

//returns adjacent tiles (non-square)
//0 = left, 1 = right, 2 = top, 3 = bottom
Tile[] getAdjTiles(Tile t) {
  Tile[] adjTiles = new Tile[4];

  for (Tile adjT : tiles) {
    int num = 0;
    if (!adjT.isSquare()) {
      //print("r");
      for (float x = -SIZE + t.x; x <= SIZE + t.x; x += SIZE * 2) {
        //print("l");
        if (adjT.x == x && adjT.y == t.y) {
          adjTiles[num] = adjT;
          //print("yay1!");
        }
        num++;
      }
      for (float y = -SIZE + t.y; y <= SIZE + t.y; y += SIZE * 2) {
        if (adjT.y == y && adjT.x == t.x) {
          adjTiles[num] = adjT;
          //print("yay2!");
        }
        num++;
      }
    }
  }
  return adjTiles;
}

void clearNonSquares() {
  for (int i = tiles.size() - 1; i >= 0; i--) {
    if (!tiles.get(i).isSquare()) {
      tiles.remove(i);
    }
  }
}

///////////////////////////////THE NEW WORLD

//1
void genSquares() {
  //0 = a full square
  for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 1; j += 1) {
      tiles.add(new Tile(160 + i * SIZE, 160 + SIZE * j, SQU));
    }
  }
}

//2
//find sides and wedges of the trees
void findSidesWedges() {
  for (int i = tiles.size() - 1; i >= 0; i--) {
    Tile t = tiles.get(i);

    if (t.isSquare()) {
      for (int x = -SIZE; x <= SIZE; x += SIZE * 2) {
        int newX = t.x + x;
        if (!contains(newX, t.y)) {
          genTilePlace(newX, t.y);
        }
      }
      for (int y = -SIZE; y <= SIZE; y += SIZE * 2) {
        int newY = t.y + y;
        if (!contains(t.x, newY)) {
          genTilePlace(t.x, newY);
        }
      }
    }
  }
  updateWedges();
}

//3
//delete sides that are adjacenet with squares on opposite sides
//in the future could make these half sides
void deleteSides() {
  PVector dir;
  //println(tiles.size() - 1);
  for (int i = tiles.size() - 1; i >= 0; i--) {
    //println(tiles.size());
    Tile side = tiles.get(i);
    if (sideOrWedge(side) == SIDE) {
      dir = getDirSquareOffSide(side);
      //going in the opposite direction of the square
      //need to set equals again? don't think so
      //println(dir.x, dir.y);
      dir.mult(-1);
      //these should be ints anyway
      //println(dir.x, dir.y);
      int x = side.x + (int) dir.x;
      int y = side.y + (int) dir.y;
      if (containsSide(x, y)) {
        //println("yer");
        //go one more in this direction
        x += (int) dir.x;
        y += (int) dir.y;
        if (containsSquare(x, y)) {
          //remove both of these sides
          //println("yee");
          removeTile(side);
          removeTile(x - (int) dir.x, y - (int) dir.y);
          i--;
        }
      }
    }
  }
}

//4
//something is messed up here
void findCorners() {
  for (int i = tiles.size() - 1; i >= 0; i--) {
    Tile s1 = tiles.get(i);
    if (isSideOrWedge(s1)) {
      for (int j = tiles.size() - 1; j >= 0; j--) {
        Tile s2 = tiles.get(j);
        if (s2 != s1 && isSideOrWedge(s2)) {
          int x = (s1.x - s2.x);
          int y = (s1.y - s2.y);
          if (abs(x) == abs(y) && abs(y) == SIZE) {
            //the tiles are diagonal from eachother
            //here, not sure what is going on
            int m = -1;
            int n = -1;
            if (!contains(s1.x, s2.y)) {
              m = s1.x;
              n = s2.y;
            } else if (!contains(s2.x, s1.y)) {
              m = s2.x;
              n = s1.y;
            }
            if (m != -1 || n != -1) {
              genCornerPlace(m, n);
            }
          }
        }
      }
    }
  }
}

//5
void genCorners() {
  for (Tile t : tiles) {
    if (t.type == CORN) {
      PVector dir = getDirOfCornSquare(t);
      float r = random(1);
      if (r < 0) {
        //empty tile
        t.verts = t.genVerts(-1);
      } else {
        //1 or 2
        int left = (int) random(1, 3); 
        int bot = (int) random(1, 3); 
        //left side
        for (int i = 2; i >= 2 - left; i--) {
          t.verts[i] = 1;
        }
        //bottom side
        t.verts[3] = 1;
        if (bot == 2) {
          t.verts[4] = 1;
        }

        rotateCorner(t, dir);
      }
    }
  }
}

//6
void genSides() {
  for (Tile t : tiles) {
    if (t.type == SIDE) {
      PVector dir = getDirSquareOffSide(t);
      if (dir.x == SIZE) {
        //these should really be void methods
        t.verts = t.genVerts(1);
      } else if (dir.x == -SIZE) {
        t.verts = t.genVerts(2);
      } else if (dir.y == SIZE) {
        t.verts = t.genVerts(3);
      } else if (dir.y == -SIZE) {
        t.verts = t.genVerts(4);
      }
    }
  }
}

//7
//match sides of sides to everything and nulls
void matchSides() {
  for (Tile t : tiles) {
    if (t.type == SIDE) {
      Tile[] tileArr = getAdjTilesAll(t);
      t.matchNulls(tileArr);
      t.matchTile(tileArr, false);
    }
  }
}

//8
void matchWedges() {
  for (Tile t : tiles) {
    if (t.type == WEDGE) {
      Tile[] tileArr = getAdjTilesAll(t);
      t.matchTile(tileArr, false);
    }
  }
}

//9
//match corners to only wedges
void matchCorners() {
  for (Tile t : tiles) {
    if (t.type == CORN || t.type == SIDE) {
      Tile[] tileArr = getAdjTilesWedge(t);
      t.matchTile(tileArr, true);
    }
  }
}

/////////////// New helpers

void updateWedges() {
  for (Tile t : tiles) {
    if (t.type == WEDGE) {
      Tile[] adjTiles = getAdjTilesAll(t);
      boolean val = true;
      for (Tile t2 : adjTiles) {
        if (t2 == null || t2.type == WEDGE) {
          val = false;
          break;
        }
      }
      if (val) {
        t.verts = t.genVerts(0);
        t.type = SQU;
        for (Tile t2 : adjTiles) {
          if (t2.type == SIDE) {
            t2.type = WEDGE;
          }
        }
      }
    }
  }
}

void genTilePlace(int x, int y) {
  int type = sideOrWedge(x, y);
  if (type != -1) {
    if (!contains(x, y)) {
      tiles.add(new Tile(x, y, type));
    }
  }
}

void genCornerPlace(int x, int y) {
  if (!contains(x, y)) {
    tiles.add(new Tile(x, y, CORN));
  }
}

boolean isSideOrWedge(Tile t) {
  return t.type == SIDE || t.type == WEDGE;
}

int sideOrWedge(Tile t) {
  return sideOrWedge(t.x, t.y);
}

int sideOrWedge(int x1, int y1) {
  int numX = 0;
  int numY = 0;
  for (int x = -SIZE; x <= SIZE; x += SIZE * 2) {
    int newX = x1 + x;
    if (containsSquare(newX, y1)) {
      numX++;
    }
  }
  for (int y = -SIZE; y <= SIZE; y += SIZE * 2) {
    int newY = y1 + y;
    if (containsSquare(x1, newY)) {
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

boolean containsSide(int x, int y) {
  return sideOrWedge(x, y) == SIDE;
}

boolean isSide(Tile t) {
  return containsSide(t.x, t.y);
}

//this Tile should be a side
//get the direction of the square of the side
PVector getDirSquareOffSide(Tile side) {
  PVector temp = new PVector();

  int x1 = side.x;
  int y1 = side.y;

  for (int x = -SIZE; x <= SIZE; x += SIZE * 2) {
    int newX = x1 + x;
    if (containsSquare(newX, y1)) {
      temp.x = newX - x1;
      temp.y = 0;
      return temp;
    }
  }
  for (int y = -SIZE; y <= SIZE; y += SIZE * 2) {
    int newY = y1 + y;
    if (containsSquare(x1, newY)) {
      temp.x = 0;
      temp.y = newY - y1;
      return temp;
    }
  }
  //println("error, the code should not get here if the tile is a side");
  return temp;
}

//get the direction of a square off the corner
PVector getDirOfCornSquare(Tile t) {
  if (t.type != CORN) {
    //println("tile is not a corner, error");
  }

  for (int x = -SIZE; x <= SIZE; x += SIZE * 2) {
    for (int y = -SIZE; y <= SIZE; y += SIZE * 2) {
      if (containsSquare(x + t.x, y + t.y)) {
        return new PVector(x, y);
      }
    }
  }
  println("no square diaganol from corner");
  return null;
}

void rotateCorner(Tile t, PVector dir) {
  //println(dir.heading());
  //float rot = dir.heading() + 7 * PI / 4;
  //rot /= PI / 2;
  //rot += 2;
  //t.verts = t.rotation(t.verts, (int) rot);
  float a = (dir.heading() + TWO_PI) % TWO_PI;
  //println(a);
  //println(PI / 4);
  //PI / 4 has an extra decimal place for some reason
  if (a == .785398) {
    //print("yeah");
    t.verts = t.rotation(t.verts, 2);
  }
  if (a == 3 * PI / 4) {
    t.verts = t.rotation(t.verts, 0);
  }
  if (a == (5 * PI) / 4) {
    t.verts = t.rotation(t.verts, 6);
  }
  if (a == 7 * PI / 4) {
    t.verts = t.rotation(t.verts, 4);
  }
}

void removeTile(Tile t) {
  tiles.remove(t);
}

void removeTile(int x, int y) {
  for (int i = tiles.size() - 1; i >= 0; i--) {
    Tile t = tiles.get(i);
    if (t.x == x && t.y == y) {
      tiles.remove(t);
    }
  }
}

boolean containsSquare(int x, int y) {
  for (Tile t : tiles) {
    if (t.isSquare()) {
      if (t.x == x && t.y == y) {
        return true;
      }
    }
  }
  return false;
}

boolean contains(int x, int y) {
  for (Tile t : tiles) {
    if (t.x == x && t.y == y) {
      return true;
    }
  }
  return false;
}

void fixUp() {
  for (Tile t : tiles) {
    if (t.type == SIDE /**|| t.type == WEDGE**/) {
      for (int i = 0; i < t.verts.length; i++) {
        int num = t.verts[i];
        if (num == 0 && t.verts[(i + 7) % 8] == 1 && t.verts[(i + 1) % 8] == 1) {
          t.verts[i] = 1;
        }
      }
    }
  }
}

void keyPressed() {

  //genSquares();
  //genFill();
  //genLastFill();
  //removeTiles();
  //squareEdgesFix();

  if (key == '1') {
    genSquares();
    findSidesWedges();
    deleteSides();
    findCorners();
    genCorners();
    genSides();
  } else if (key == '2') {
    matchSides();
    matchWedges();
    //wedgeFix();
    matchCorners();
  } else if (key == '3') {  
    fixUp();
    removeTiles();
  } else if (key == '4') {
    squareEdgesFix();
  } else if (key == ' ') {
    //clearNonSquares();
  } else if (key == 'd') {
    clearNonSquares();
  } else {
    tiles.clear();
  }
}

void mousePressed() {
  if (mouseButton == LEFT) {
    int x = (int) (mouseX / SIZE) * SIZE;
    int y = (int) (mouseY / SIZE) * SIZE;
    tiles.add(new Tile(x, y, SQU));
  } else if (mouseButton == RIGHT) {
    findSidesWedges();
    deleteSides();
    findCorners();
    genCorners();
    genSides();
    matchSides();
    matchWedges();
    matchCorners();
    fixUp();
    removeTiles();
    squareEdgesFix();
  }
}
