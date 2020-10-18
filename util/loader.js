const { Discord, fs, arrayOfFile } = require(`./function.js`)
const Games = require("../Games");


// import events
const loadEvents = (bot,dir = "./events") => {
  
  const eventsPath =  arrayOfFile(dir,'js',false);
  eventsPath.forEach( pathFile => {
    const evt = require("../"+pathFile);
    const evtName = pathFile.split("/").pop().split(".")[0]
  bot.on(evtName,evt.bind(null,bot));
  console.log(`Event loaded: ${evtName}`) ;  
  });
};

// import of commands from all Games

const setCommandsGames = function (bot) {

  Games.nameGames.forEach( nameGame => {

    const collectionCommands = new Discord.Collection()
    const commandPath =  arrayOfFile(`./Games/${nameGame}`,'commands.js',false);
    commandPath.forEach( pathFile => {
      pathFile = "../"+pathFile;
      console.log("load commands from ",pathFile)
      const listCommands = require(pathFile);
      listCommands.commands.forEach( (command) => {
        collectionCommands.set(command.name,command);
        console.log("commands loaded : ",command.name)
      });
    });
    bot.commands.set(nameGame,collectionCommands)


  });
}

// import of commands from main-commands
const loadCommands = (bot) => {
  const commandPath =  arrayOfFile('.','commands.js',false);
  setCommandsGames(bot);
  bot.commands.set("main",new Discord.Collection());
  commandPath.forEach( pathFile => {
    const listCommands = require("../"+pathFile);
    console.log(`load command from ${pathFile}`)
    listCommands.commands.forEach( (command) => {
      bot.commands.get("main").set(command.name,command);
      console.log(`commands loaded : ${command.name}`)
    });
  });
};



const launchGames = function(bot,parent,name) {

  if(Games.nameGames.find(game => game == name)){
      return Games[name].launch(bot,parent);
  }
  else{
    // console.log("Game undefined ");
    return undefined;
  }
}



module.exports = {
  loadEvents,
  loadCommands,
  launcher : launchGames
}