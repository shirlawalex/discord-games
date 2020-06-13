const GameTemplate = require('./Games/GameTemplate/gameTemplate.js')
const Avalon = require('./Games/Avalon/avalon.js')

var launchGames = function(parent,nameGame) {
  switch (nameGame) {
    case "GameTemplate":
      return GameTemplate.launch(parent)
      break;
    case "Avalon":
      return Avalon.launch(parent)
      break;
    // case "Dictateur":
      //   Dictateur.launch(guild)
      //   break;
    default:
      return undefined;

  }
  // let commandUsed =
  //Avalon.parse(message) // || Uno.parse(message)
}

exports.launcher = launchGames;
