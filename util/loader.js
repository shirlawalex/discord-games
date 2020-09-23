const { Discord, fs, arrayOfFile } = require(`./function.js`)

// import events
const loadEvents = (bot,dir = "./events") => {
  
  const eventsPath =  arrayOfFile(dir,'js',false);
  bot.commands.set("main",new Discord.Collection());
  eventsPath.forEach( pathFile => {
    const evt = require("../"+pathFile);
    const evtName = pathFile.split("/").pop().split(".")[0]
  bot.on(evtName,evt.bind(null,bot));
  console.log(`Event loaded: ${evtName}`) ;  
  });
};

// import of commands from main-commands
const loadCommands = (bot) => {
  const commandPath =  arrayOfFile('.','commands.js',false);
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


module.exports = {
  loadEvents,
  loadCommands
}