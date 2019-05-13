ArrayList<Tile> tiles;
float SIZE = 32;


void setup() {
  size(640, 640);
  tiles = new ArrayList<Tile>();
  genTiles();
}

void draw() {
  background(255);
  for(Tile t: tiles){
    t.display();
  }
}

void genTiles() {
  for (int x = 0; x < width; x += SIZE) {
    for (int y = 0; y < height; y += SIZE) {
      genTile(x, y);
    }
  }
}

void genTile(float x, float y) {
  //int[] sides = new int[8];
  float r = random(8);
  Tile t = new Tile(x, y, r);
  tiles.add(t);
}
