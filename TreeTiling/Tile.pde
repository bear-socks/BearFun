
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
    if(isSquare()){
      fill(0,0, 255);
    }
    stroke(255, 0, 0);
    pushMatrix();
    translate(x, y);
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

    //square
    if (r == 0) {
      verts = genVerts(0, 7);
    } else {
      int add = (int) random(1, 3);
      int add2 = (int) random(2);
      if (add == add2) {
        //add += 1;
      }
      if (random(1) < .5) {
        verts = genVerts(4-add2, 6 + add);
      } else {
        verts = genVerts(4 - add, 6 + add2 );
      }

      //println(r);

      //right side whole
      if (r == 1) {
      } 
      //left side whole
      else if (r == 2) {
        verts = rotation(verts, 4);
      } 
      //bottom side whole 
      else if (r == 3) {
        verts = rotation(verts, 6);
      } 
      //top side whole
      else if (r == 4) {
        verts = rotation(verts, 2);
      }
    }


    //verts = randomRotation(verts);

    return verts;
  }

  int[] genVerts(int start, int finish) {
    int[] verts = {0, 0, 0, 0, 0, 0, 0, 0};

    for (int i = start; i <= finish; i++) {
      verts[i % 8] = 1;
    }   

    return verts;
  }

  int[] rotation(int[] verts, int r) {
    int[] nVert = new int[8];
    for (int i = r; i < r + nVert.length; i++) {
      nVert[i % nVert.length] = verts[i - r];
    }
    return nVert;
  }

  int[] randomRotation(int[] verts) {
    //rotate(((int) random(4)) * PI / 2);
    return verts;
  }

  boolean isSquare() {
    for (int n : verts) {
      //print(n);
      if (n == 0) {
        return false;
      }
    }
    return true;
  }

  //0 = left, 1 = right, 2 = top, 3 = bottom
  void matchTile(Tile[] tileArr) {
    for (int i = 0; i < 4; i++) {
      Tile adjT = tileArr[i];
      if (adjT != null) {
        //not sure about i == 0
        if(i == 0){
          //matching up this particular side
          for(int n = 4; n <= 6; n++){
            verts[6 - n % 8] = adjT.verts[n % 8];
          }
        }
        else if(i == 1){
          for(int n = 4; n <= 6; n++){
            verts[n] = adjT.verts[6 - n % 8];
          }
          //for(int q = 0; q <= 2; q++){
          //  println(verts[q] == adjT.verts[6 - q]);
          //}
          //verts = genVerts(0, 8);
        }
        else if(i == 2){
          for(int n = 6; n <= 8; n++){
            verts[n % 8] = adjT.verts[(10 - n) % 8];
          }
        }
        else if(i == 3){
          for(int n = 6; n <= 8; n++){
            verts[(10 - n) % 8] = adjT.verts[n % 8];
          }
        }
        println(i);
      }
      //println(tileArr[i]);
    }
  }
}
