//const Avalon = require('./Games/Avalon/avalon.js')
const GameTemplate = require('./Games/GameTemplate/gameTemplate.js')

var launchGames = function(guild,nameGame) {
  switch (nameGame) {
    case "GameTemplate":
      GameTemplate.launch(guild)
      break;
    case "Avalon":
      // Avalon.launch(guild)
      break;
    // case "Dictateur":
      //   Dictateur.launch(guild)
      //   break;
    default:

  }
  // let commandUsed =
  //Avalon.parse(message) // || Uno.parse(message)
}

exports.launch = launchGames;
