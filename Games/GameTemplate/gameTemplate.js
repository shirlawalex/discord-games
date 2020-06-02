const Games = require("./../games")

module.exports  = class GameTemplate extends Games {

    //Customized function

    static match(message) {
      // return (message.content == "Test")
      return true
    }

    static helloWorld (guild) {
      // guild.channels.cache.first.send('Hello World !')
      console.log("Hello World ! Game Template")
    }

    static nameChannel () {
      let number = Math.floor((Math.random() * 65535) + 4096) //a random number with 4 hexa digit
      return 'GameTemplate-' + number.toString(16);
    }
  }
