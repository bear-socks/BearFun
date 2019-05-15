ArrayList<Tile> tiles;
int SIZE = 32;

int SQU = 0;

void setup() {
  size(640, 640);
  tiles = new ArrayList<Tile>();
  genTiles();

  int[] yeah = {0, 0, 0, 0, 1, 1, 1, 1};
  int[] yeah2 = {1, 1, 1, 0, 0, 0, 0, 1};
  tiles.add(new Tile(50, 50, yeah));
  tiles.add(new Tile(50 + SIZE, 50, yeah2));
}

void draw() {
  background(255);
  for (Tile t : tiles) {
    t.display();
  }
}

void genTiles() {
  //for (int x = 0; x < width; x += SIZE) {
  //  for (int y = 0; y < height; y += SIZE) {
  //    genTile(x, y);
  //  }
  //}
  genSquares();
  genFill();
  genLastFill();
}

void genTile(int x, int y) {
  //int[] sides = new int[8];
  float r = random(8);
  genTile(x, y, r, r);
}

Tile genTile(int x, int y, float rMin, float rMax) {
  //int[] sides = new int[8];
  float r = random(rMin, rMax);
  Tile t = genTile(x, y, r);
  return t;
}

Tile genTile(int x, int y, float r) {
  //int[] sides = new int[8];
  Tile t = new Tile(x, y, r);
  Tile[] tileArr = getAdjTiles(t);
  t.matchTile(tileArr);
  return t;
}

void genSquares() {
  //0 = a full square
  for (int i = 0; i < 8; i++) {
    for (int j = 0; j < 5; j += 4) {
      tiles.add(new Tile(320 + i * 32, 320 + 32 * j, SQU));
    }
  }
}

void genFill() {
  for (int i = tiles.size() - 1; i >= 0; i--) {
    Tile t = tiles.get(i);
    //create edges of the trees
    if (t.isSquare()) {
      int num = 1;
      for (int x = -SIZE; x <= SIZE; x += SIZE * 2) {
        int newX = t.x + x;
        if (!containsSquare(newX, t.y)) {
          tiles.add(genTile(newX, t.y, num));
        }
        num++;
      }
      for (int y = -SIZE; y <= SIZE; y += SIZE * 2) {
        int newY = t.y + y;
        if (!containsSquare(t.x, newY)) {
          tiles.add(genTile(t.x, newY, num));
        }
        num++;
      }
    }
  }
}

void genLastFill() {
  //find diaganols and fill in

  for (int m = tiles.size() - 1; m >= 0; m--) {
    Tile t = tiles.get(m);
    for (int n = tiles.size() - 1; n >= 0; n--) {
      Tile t2 = tiles.get(n);
      if (t2 != t) {
        int x = (t.x - t2.x);
        int y = (t.y - t2.y);
        if (abs(x) == abs(y) && abs(y) == SIZE) {
          //the tiles are diagonal from eachother
          int i = 0;
          int j = 0;
          if (!contains(t.x, t2.y)) {
            i = t.x;
            j = t2.y;
          } else if (!contains(t2.x, t.y)) {
            i = t2.x;
            j = t.y;
          }
          if (i != 0 && j != 0) {
            tiles.add(genTile(i, j, -1));
          }
        }
      }
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

//returns adjacent tiles (non-square)
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

void keyPressed() {
  tiles.clear();
  genTiles();
}
