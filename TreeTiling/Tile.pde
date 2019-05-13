
class Tile {
  float x, y;
  //collection of 8 points to represent if each point is connected or not
  int[] verts;
  public Tile(float x_, float y_, int[] verts_) {
    x = x_;
    y = y_;
    verts = verts_;
  }

  public Tile(float x_, float y_, float sideNum) {
    x = x_;
    y = y_;
    verts = genVerts(sideNum);
  }

  void display() {
    fill(0);
    stroke(255, 0, 0);
    pushMatrix();
    translate(x,y);
    beginShape();
    
        
    for(int i : verts){
     print(i + ", "); 
    }
    println();
    
    //verts starts at top left and goes ccw
    for (int i = 0; i < 8; i++) {
      if (verts[i] == 1) {
        placeVertex(i);
      }
    }
    endShape(CLOSE);
    popMatrix();
  }

  void placeVertex(int i) {
    switch(i)
    {

    case 0:
      vertex(0, 0);
    case 1:
      vertex(0, SIZE / 2);
    case 2:
      vertex(0, SIZE);
    case 3:
      vertex(SIZE / 2, SIZE);
    case 4:
      vertex(SIZE, SIZE);
    case 5:
      vertex(SIZE, SIZE / 2);
    case 6:
      vertex(SIZE, 0);
    case 7:
      vertex(SIZE / 2, 0);
    }

  }

  int[] genVerts(float r) {
    int[] verts = new int[8];
    
    if(r < 0){
      verts = genVerts(0, 7);
    }
    else if(r < 10){
      println("here");
      int corner = 0;
      int oppositeCorner = (corner + 4) % 8;
      verts = genVerts(corner, oppositeCorner);
    }
         
    //for (int i = 0; i < 8; i ++) {
    //  sides[i] =
    //}
    
    verts = randomRotation(verts);

    return verts;
  }
  
  int[] genVerts(int start, int finish){
    int[] verts = {0,0,0,0,0,0,0,0};
    
    for(int i = start; i < finish; i++){
      verts[i] = 1;
    }   
    
    return verts;
  }
  
  int[] randomRotation(int[] verts){
   return verts; 
  }
}
