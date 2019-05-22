
int CORN = 0;
int SIDE = 1;
int WEDGE = 2;
int SQU = 3;

class Tile {
  int x, y;
  //collection of 8 points to represent if each point is connected or not
  int[] verts;
  boolean nextDiag = false;
  
  //////////////////// NEW
  int type;
  
  public Tile(int x_, int y_, int[] verts_) {
    x = x_;
    y = y_;
    verts = verts_;
  }

  //public Tile(int x_, int y_, float sideNum) {
  //  x = x_;
  //  y = y_;
  //  verts = genVerts(sideNum);
  //}
  
  public Tile(int x_, int y_, int type_) {
    x = x_;
    y = y_;
    type = type_;
    //a square placeholder for now
    //verts = genVerts(0);
  }

  void setColor(){
   if(type == CORN){
    fill(255, 0, 255); 
   }
   else if(type == SIDE){
    fill(255, 0, 0);
   }
   else if(type == WEDGE){
    fill(0, 255, 0); 
   }
   else if(type == SQU){
    fill(0, 0, 255); 
   }
   else{
    fill(0); 
   }
  }

  void display() {
    setColor();
    //noFill();
    //noStroke();
    //if (isSquare()) {
    //  fill(0, 0, 255, 100);
    //}
    //if (nextDiag) {
    //  fill(0, 255, 0);
    //}
    //stroke(255, 0, 0);
    pushMatrix();
    translate(x, y);
    ellipse(SIZE / 2, SIZE / 2, 10, 10);
    //println(getCode());
    //image(imgs.get(getCode()), 0, 0);   
    //beginShape();
    ////verts starts at top left and goes ccw
    //for (int i = 0; i < 8; i++) {
    //  if (verts[i] == 1) {
    //    placeVertex(i);
    //  }
    //}
    //endShape(CLOSE);
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


    if (r == -1) {
      //corner piece
      verts = genVerts(0, -100);
    }
    //square
    else if (r == 0) {
      verts = genVerts(0, 7);
    } else {
      int add = (int) random(1, 3);
      int add2 = (int) random(0, 2);
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
    //for (int n : verts) {
    //  //print(n);
    //  if (n == 0) {
    //    return false;
    //  }
    //}
    //return true;
    return type == SQU;
  }

  //0 = left, 1 = right, 2 = top, 3 = bottom
  void matchTile(Tile[] tileArr) {
    for (int i = 0; i < 4; i++) {
      Tile adjT = tileArr[i];
      if (adjT != null) {
        //not sure about i == 0
        if (i == 0) {
          //matching up this particular side
          for (int n = 4; n <= 6; n++) {
            verts[6 - n % 8] = adjT.verts[n % 8];
          }
        } 
        if (i == 1) {
          for (int n = 4; n <= 6; n++) {
            verts[n] = adjT.verts[6 - n % 8];
          }
          //for(int q = 0; q <= 2; q++){
          //  println(verts[q] == adjT.verts[6 - q]);
          //}
          //verts = genVerts(0, 8);
        } 
        if (i == 2) {
          for (int n = 6; n <= 8; n++) {
            verts[n % 8] = adjT.verts[(10 - n) % 8];
          }
        } 
        if (i == 3) {
          for (int n = 6; n <= 8; n++) {
            verts[(10 - n) % 8] = adjT.verts[n % 8];
          }
        }
        //println(i);
      }
      //println(tileArr[i]);
    }
  }

  //erase vertices next to empty tiles
  void matchNulls(Tile[] tileArr) {
    for (int i = 0; i < 4; i++) {
      Tile adjT = tileArr[i];
      if (adjT == null) {
        //not sure about i == 0
        if (i == 0) {
          //matching up this particular side
          for (int n = 5; n <= 5; n++) {
            verts[6 - n % 8] = 0;
          }
        } 
        if (i == 1) {
          for (int n = 5; n <= 5; n++) {
            verts[n] = 0;
          }
          //for(int q = 0; q <= 2; q++){
          //  println(verts[q] == adjT.verts[6 - q]);
          //}
          //verts = genVerts(0, 8);
        } 
        if (i == 2) {
          for (int n = 7; n <= 7; n++) {
            verts[n % 8] = 0;
          }
        } 
        if (i == 3) {
          for (int n = 7; n <= 7; n++) {
            verts[(10 - n) % 8] = 0;
          }
        }
        //println(i);
      }
      //println(tileArr[i]);
    }
    removeIsolatedVertices();
  }

  void removeIsolatedVertices() {
    for (int i = 0; i < 8; i++) {
      float last = verts[(i + 8 -1) % 8];
      float next = verts[(i + 1) % 8];
      if (last == 0 && next == 0) {
        verts[i] = 0;
      }
    }
  }

  void fixSquare(Tile[] adjT) {
    for (int i = 0; i < adjT.length; i++) {
      if (adjT[i] == null) {
        //if (index != -1) {
        //  println("ERROR FIXSQUARE");
        //}
        removeSideIndex(i);
      }
    }
    removeIsolatedVertices();
  } 

  void removeSideIndex(int index) {
    //converting to the vertex coordinate 
    if (index != -1) {
      println(index);
      if (index == 0) {
        index = 1;
      } else if (index == 1) {
        index = 5;
      } else if (index == 2) {
        index = 7;
      }
      //index = 3 both times
      println(index);
      println();
      verts[index] = 0;
    }
  }

  void eraseVerts(int one, int two) {
    verts[one] = -1;
    verts[two] = -1;
  }

  String getCode() {
    String str = "";
    for (int i = 0; i < verts.length; i++) {
      str += verts[i];
    }
    return str;
  }

  //int convertBinary(){
  //  int sum = 0;
  //  for(int i = 0; i < verts.length; i++){
  //    if(i == 0){
  //      //1 or 0
  //      sum += verts[0];
  //    }
  //    else{
  //      sum += pow(verts[i] * 2, i);
  //    }
  //    print(verts[i]);
  //  }
  //  return sum;
  //}
}
