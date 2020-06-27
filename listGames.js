const { Discord, fs, displayText, arrayOfFile } = require(`./function.js`)

const GameTemplate = require('./Games/GameTemplate/gameTemplate.js')
const Avalon = require('./Games/Avalon/avalon-main.js')

// Launcher of Games

const launchGames = function(bot,parent,nameGame) {
  switch (nameGame) {
    case "GameTemplate":
      return GameTemplate.launch(bot,parent)
      break;
    case "Avalon":
      return Avalon.launch(bot,parent)
      break;
    // case "Dictateur":
    //     Dictateur.launch(guild)
    //     break;
    default:
      return undefined;

  }
}

exports.launcher = launchGames;


// import of commands from all Games

const commandsGames = function () {
  const collection = new Discord.Collection()
  const commandPath =  arrayOfFile('./Games','commands.js',true);
  commandPath.forEach( pathFile => {
    const key = pathFile.split("/").pop().slice(0,-12);
    collection.set(key,fs.readFileSync(pathFile));
  });
  return collection
}
exports.commandsGames = commandsGames;
