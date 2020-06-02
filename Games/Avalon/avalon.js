const Games = require("./../games")

module.exports  = class Avalon extends Games {

    //Customized function
    var nameGame = "Avalon"

    static match(message) {
      // return (message.content == "Test")
      return true
    }

    static helloWorld (guild) {
      // guild.channels.cache.first.send('Hello World !')
      console.log("Hello World ! Avalon")
    }

    static nameChannel () {
      let number = Math.floor((Math.random() * 65535) + 4096) //a random number with 4 hexa digit
      return nameGame +"-"+ number.toString(16);
    }
  }
