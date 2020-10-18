const Games = require("./../games")

module.exports  = class GameTemplate extends Games {

    //Customized function
    static nameGame = "GameTemplate"

    privateConstructor(channel){
      return new gameTemplate(channel)
    }

    constructor(channel) {
      super(channel)
      this.name = "GameTemplate"
    }

    handleReaction(reaction,user){
      console.log("Template handle reaction")
    }

  }
