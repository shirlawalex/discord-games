const { Discord, arrayOfFile } = require(`./util/function.js`)

const GameTemplate = require('./Games/GameTemplate/gameTemplate.js')
const Avalon = require('./Games/Avalon/avalon-main.js')

// Launcher of Games

const launchGames = function(bot,parent,nameGame) {
  switch (nameGame) {
    case "GameTemplate":
    return GameTemplate.launch(bot,parent)
    break;
    case "Avalon":
    bot.commands.set("Avalon",commandsGames("Avalon"));
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

const commandsGames = function (nameGame) {
  const collection = new Discord.Collection()
  const commandPath =  arrayOfFile(`./Games/${nameGame}`,'commands.js',false);
  commandPath.forEach( pathFile => {
    console.log("load commands from ",pathFile)
    const listCommands = require(pathFile);
    listCommands.commands.forEach( (command) => {
      collection.set(command.name,command);
      console.log("commands loaded : ",command.name)
    });
  });
  return collection
}

exports.commandsGames = commandsGames;
