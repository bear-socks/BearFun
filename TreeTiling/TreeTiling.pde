ArrayList<Tile> tiles;
int SIZE = 32;


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
  //for (int x = 0; x < width; x += SIZE) {
  //  for (int y = 0; y < height; y += SIZE) {
  //    genTile(x, y);
  //  }
  //}
  genSquares();
  genFill();
  genLastFill();
}

void genTile(float x, float y) {
  //int[] sides = new int[8];
  float r = random(8);
  genTile(x, y, r, r);
}

void genTile(float x, float y, float rMin, float rMax) {
  //int[] sides = new int[8];
  float r = random(rMin, rMax);
  Tile t = new Tile(x, y, r);
  tiles.add(t);
}

void genSquares(){
  //0 = a full square
  tiles.add(new Tile(320, 320, 0));
  
}

void genFill(){
  ArrayList<Tile> newTiles = new ArrayList<Tile>();
  for(Tile t : tiles){
    if(t.isSquare()){
      for(int x = -SIZE; x <= SIZE; x += SIZE * 2){
        genTile(t.x + x, t.y, 1, 8);
      }
      for(int y = -SIZE; y <= SIZE; y += SIZE * 2){
        genTile(t.x, t.y + y, 1, 8);
      }
    }
  }
  
 
}

void genLastFill(){
  
}
