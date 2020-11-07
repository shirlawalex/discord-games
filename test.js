/*let calculetteMixin = Base => class extends Base {
  calc() { }
};

let aleatoireMixin = Base => class extends Base {
  randomiseur() { }
};
Une classe utilisant ces mix-ins peut alors être écrite de cette façon :

class Toto { }
class Truc extends calculetteMixin(aleatoireMixin(Toto)) { }

*/

class Jeux {
  constructor(name)
    {
      this.name = name;
      this.joueurs = 2;
    }

    nom(){
      console.log(this.name);
    }

    nombre(){
      console.log(this.joueurs);
    }
}

let Cartes = Base => class extends Base {
  constructor(name){
    super(name);
    this.carte = 44;
  }

  tire(){
    console.log(this.carte );
  }
}

let Des = Base => class extends Base {
  constructor(name){
    this.name = name;
    this.des = [1,2,3,4,5,6];
  }
}


class President extends Cartes(Jeux){
  constructor(){
    super("President");
  }
  
  static best(){
    console.log("2");
  }

}


let duel = new Jeux("duel");
duel.nom();
duel.nombre();


let partie1 = new President();
partie1.tire();
President.best();
partie1.nom();
