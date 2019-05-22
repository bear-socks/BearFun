ArrayList<Tile> tiles;
int SIZE = 32;


//can be a regular array
HashMap<String, PImage> imgs = new HashMap<String, PImage>();

void setup() {
  size(640, 640);

  tiles = new ArrayList<Tile>();

  loadImages();

  //int[] yeah = {0, 0, 0, 0, 1, 1, 1, 1};
  //int[] yeah2 = {1, 1, 1, 0, 0, 0, 0, 1};
  ////tiles.add(new Tile(50, 50, yeah));
  //tiles.add(new Tile(50 + SIZE, 50, yeah2));
  //println(" " + new Tile(50 + SIZE, 50, yeah2).convertBinary());

  //genSquares();
  //genTiles();
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
}

void draw() {
  //noLoop();
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


//void genTile(int x, int y) {
//  //int[] sides = new int[8];
//  float r = random(8);
//  genTile(x, y, r, r);
//}

//Tile genTile(int x, int y, float rMin, float rMax) {
//  //int[] sides = new int[8];
//  float r = random(rMin, rMax);
//  Tile t = genTile(x, y, r);
//  return t;
//}

//Tile genTile(int x, int y, float r) {
//  //int[] sides = new int[8];
//  Tile t = new Tile(x, y, r);
//  Tile[] tileArr = getAdjTiles(t);
//  t.matchTile(tileArr);
//  return t;
//}



//x and y are the position of the new Tile
//void fixAdjCorners(Tile t1, Tile t2, float x, float y) {
//  t1.matchNulls(getAdjTilesAll(t1));
//  t2.matchNulls(getAdjTilesAll(t2));
//  t1.matchTile(getAdjTilesAll(t1));
//  t1.matchTile(getAdjTilesAll(t1));
//}

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
      tiles.remove(t);
    }
  }
}

void squareEdgesFix() {
  for (Tile t : tiles) {
    if (t.isSquare()) {
      t.fixSquare(getAdjTilesAll(t));
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
      tiles.add(new Tile(320 + i * 32, 320 + 32 * j, SQU));
    }
  }
}

//2
//find sides and wedges of the trees
void findSidesWedges() {
  for (int i = tiles.size() - 1; i >= 0; i--) {
    Tile t = tiles.get(i);

    if (t.isSquare()) {
      int num = 1;
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
}

//3
void deleteSides() {
}

//4
void findCorners() {
}

//5
void genCorners() {
}

//6
void genSides() {
}

//7
void matchSides() {
}

//8
void matchWedges() {
}

/////////////// New helpers

void genTilePlace(int x, int y) {
  int type = squareOrWedge(x, y);
  if (type != -1) {
    tiles.add(new Tile(x, y, type));
  }
}

int squareOrWedge(int x1, int y1) {
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

void keyPressed() {

  //genSquares();
  //genFill();
  //genLastFill();
  //removeTiles();
  //squareEdgesFix();

  if (key == '1') {
    genSquares();
  } else if (key == '2') {
    findSidesWedges();
  } else if (key == '3') {
    deleteSides();
  } else if (key == '4') {
    findCorners();
  } else if (key == '5') {
    genCorners();
  } else if (key == '6') {
    genSides();
  } else if (key == '7') {
    matchSides();
  } else if (key == '8') {
    matchWedges();
  } else if (key == ' ') {
    //clearNonSquares();
  } else if (key == 'd') {
    clearNonSquares();
  } else {
    tiles.clear();
  }
}

void mousePressed() {
  int x = (int) (mouseX / 32) * 32;
  int y = (int) (mouseY / 32) * 32;
  tiles.add(new Tile(x, y, SQU));
}
