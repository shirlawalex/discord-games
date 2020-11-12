const { Discord, fs } = require(`../../util/function.js`)


module.exports  = class Player {
  
    constructor(user){
      this.info = user;
      this.id = user.id;
      this.name = user.displayName;
    }

    static randomize(players){
      let order = []
      players.forEach((k, v) => {
        order.push(v)
      });
      
      order.sort(function(){
        return 0.5-Math.random();
      })

      return order;
    }
}