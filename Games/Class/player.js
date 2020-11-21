const { Discord, fs } = require(`../../util/function.js`)


module.exports  = class Player {
  
    constructor(game,user){
      this.game = game;
      this.info = user;
      this.id = user.id;
      this.points = 0;
    }

    static randomizeOrder(players){
      let order = []
      players.forEach((k, v) => {
        order.push(v)
      });
      
      order.sort(function(){
        return 0.5-Math.random();
      })

      return order;
    }

    addPoint(i){
      if(i == undefined){
        this.points += 1;
      }else{
        this.points += i;
      }
      return this.points;
    }

    displayName(){
      return this.game.channel.members.get(this.id).displayName;
    }
}