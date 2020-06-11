const Games = require("./../games")

module.exports  = class GameTemplate extends Games {

    //Customized function
    static nameGame = "GameTemplate"

    static match(message) {
      // return (message.content == "Test")
      return true
    }

    static helloWorld (guild) {
      // guild.channels.cache.first.send('Hello World !')
      console.log("Hello World ! Game Template")
    }

  }
