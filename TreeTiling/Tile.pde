
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
    //stroke(255, 0, 0);
    pushMatrix();
    translate(x,y);
    beginShape();
    
        
    //for(int i : verts){
    // //print(i + ", "); 
    //}
    //println();
    
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
      break;
    case 1:
      vertex(0, SIZE / 2);
      break;
    case 2:
      vertex(0, SIZE);
      break;
    case 3:
      vertex(SIZE / 2, SIZE);
      break;
    case 4:
      vertex(SIZE, SIZE);
      break;
    case 5:
      vertex(SIZE, SIZE / 2);
      break;
    case 6:
      vertex(SIZE, 0);
      break;
    case 7:
      vertex(SIZE / 2, 0);
      break;
    }

  }

  int[] genVerts(float r) {
    int[] verts = new int[8];
    
    if(r < 1){
      verts = genVerts(0, 7);
    }
    else if(r < 2){
      //println("here");
      int corner = 0;
      int oppositeCorner = (corner + 4) % 8;
      verts = genVerts(corner, oppositeCorner);
    }
    else{
      verts = genVerts(1, (int) random(3, 8));
    }
         
    //for (int i = 0; i < 8; i ++) {
    //  sides[i] =
    //}
    
    verts = randomRotation(verts);

    return verts;
  }
  
  int[] genVerts(int start, int finish){
    int[] verts = {0,0,0,0,0,0,0,0};
    
    for(int i = start; i <= finish; i++){
      verts[i] = 1;
    }   
    
    return verts;
  }
  
  int[] randomRotation(int[] verts){
   //rotate(((int) random(4)) * PI / 2);
   return verts; 
  }
  
  boolean isSquare(){
   for(int n : verts){
     if(n == 0){
       return false;
     }
   }
   return true;
  }
}
