export default class Base{

  constructor(baseSprite, animArr){
    //the sprite object (ex: this.player in the Player class)
    this.sprite = baseSprite;
    //0 = closed, 1 = open
    this.animArr = animArr;
    //is the base open?
    this.isOpen = false;
  }

  setOpen(b){
    this.isOpen = b;
    var val = 0;
    if(this.isOpen){
      val = 1;
    }
    this.sprite.anims.play(this.animArr[val], true);
  }

}
