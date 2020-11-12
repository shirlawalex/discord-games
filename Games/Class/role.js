

/* C'est une classe de fonctionnalité qu'on peut additione aux jeux pour ajouter des fonctionnalité */

let Role = Base => class Role extends Base {
  static listRole = ["gentil","mechant","neutre"];
  static emojiRole = new Discord.Collection()
  .set("gentil","😇")
  .set("mechant","😈")
  .set("neutre","🙂")
  //😇😈🙂
  constructor(user){
    super(user);
    this.roleGiven = 0;
    this.roleLeft = Role.listRole;
  }
  
  
  static compare(joueur1,joueur2){
    return joueur1 == joueur2;
  }

  tire(){
    this.roledonne ++;  
  }

  nbtire(){
    console.log(this.roledonne);
  }

  displayLeftRole(){
    return this.roleLeft;
  }

  static randomRole(){
    return Role.listRole[0];
  }

  randomLeftRole(){
    if(this.roleLeft.length != 0)  return this.roleLeft[0];
    else return undefined;
  }

  resetRole(){
    this.roleLeft = Role.listRole;
  }

}

exports.Role = Role;
