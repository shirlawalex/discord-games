const Games = require("./../games")

module.exports  = class Avalon extends Games {

    //Customized function
    static nameGame = "Avalon"

    static privateConstructor(channel){
      return new Avalon(channel)
    }

    static match(message) {
      // return (message.content == "Test")
      return true
    }

    static helloWorld (guild) {
      // guild.channels.cache.first.send('Hello World !')
      console.log("Hello World ! Avalon")
    }

    handleReaction(reaction,user){
      console.log("Avalon handle reaction")
    }

    constructor(channel) {
      super(channel)
      this.name = "Avalon"
    }

  }
