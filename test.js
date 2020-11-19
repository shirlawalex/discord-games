class Games {
  constructor(name)
  {
    this.name = name;
    this.joueurs = 2;
  }

  name(){
    console.log(this.name);
  }

  nombre(){
    console.log(this.joueurs);
  }
}

let Cards = Base => class extends Base {
constructor(name){
    super(name);
    this.best = "King Heart";
  }

  static number = 44;

  draw(){
    console.log("7 Heart");
  }

  static info = {
    name : "Games",
    function : (game) => {
      console.log("fonction");
      console.log("best card is "+game.best);
      game.draw();
      console.log(Cards.number); //undefined
      console.log(this.number); //undefined
    }
  }
}


let Dices = Base => class extends Base {
  constructor(name){
    this.name = name;
    this.Dices = [1,2,3,4,5,6];
  }
}


class President extends Cards(Games){
  constructor(){
    super("President");
    this.best = "2 Heart";
  }
  
  static drawBest(game){
    console.log(game.best);
  }

}


let duel = new Games("duel");
duel.nombre(); // 2

let partie1 = new President();
President.drawBest(partie1); 
//2 Heart

//partie1.name(); 
//TypeError: partie1.name is not a function 

President.info.function(partie1); 
// function 
// best card is 2 Heart
// 7 Heart
// undefined ??? 

