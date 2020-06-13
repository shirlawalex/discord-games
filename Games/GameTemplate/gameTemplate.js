const Games = require("./../games")

module.exports  = class GameTemplate extends Games {

    //Customized function
    static nameGame = "GameTemplate"

    privateConstructor(channel){
      return new gameTemplate(channel)
    }

    static match(message) {
      // return (message.content == "Test")
      return true
    }

    static helloWorld (guild) {
      // guild.channels.cache.first.send('Hello World !')
      console.log("Hello World ! Game Template")
    }

    constructor(channel) {
      super(channel)
      this.name = "GameTemplate"
    }

    handleReaction(reaction,user){
      console.log("Template handle reaction")
    }

  }
