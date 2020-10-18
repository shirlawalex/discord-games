const { Discord, fs, arrayOfFile } = require(`../util/function.js`)
const config = require(`../config.json`);
const mongoose = require("mongoose");
const { DEFAULTSETTINGS : defaults} = require("../config.json");
const { Guild } = require("discord.js");


//When User send a message

/*var execute = (bot,env,message) => {
  const args = env.args ;
  const id = env.id ;
  const commandName = env.commandName ;
  const game = env.game ;
  const name = env.name ;

  const command = bot.commands.get(name).get(commandName);

  command.execute(bot,game,message,args);

  if(command.delete != undefined && command.delete){
    message.delete({timeout : 10000}).then(msg => console.log(`Deleted message from ${msg.author.username} after 10 seconds.`)).catch(console.error);
  }
}*/
/*
Execute the command called
*/
module.exports = (bot,message) => {
  if(message.author.bot) return;

  console.log("PRIVATE MESSAGE IS NOT IMPLETENDED YET.")
  console.log(message.content);

  if(!message.content.startsWith(bot.defaultSettings.prefix)) return;

  //all variables in one environnement call "env"
  const env = new Object()
  env.args = message.content.slice(bot.defaultSettings.prefix.length).split(/ +/);
  env.commandName = env.args.shift().toLowerCase();

  // in a game channel
  /*
  homonym commands from game rewrite the main commands
  */
  env.id = message.channel.id
  

    //in private channel
  /* forbiden for the moment because can't check which server is concern */
  /* Maybe check ig message is in the cache of game or before the command the name of the game or quote */
  /* it give the first server in the collection */
  // bot.gamesOngoing.forEach((item, i) => {
  //   const game = item;
  //   const name = item.name;
  //   if(bot.commands.get(name).has(commandName)){
  //     bot.commands.get(name).get(commandName).execute(bot,env,message);
  //   }
  // });
  
}

