const { Discord, fs, displayText, arrayOfFile } = require(`../util/function.js`)
const config = require(`../config.json`);
const Games = require(`../listGames.js`);

const mongoose = require("mongoose");
const { DEFAULTSETTINGS : defaults} = require("../config.json");
const { Guild } = require("discord.js");

let PREFIX = config.prefix

//When User send a message

var execute = (bot,env,message) => {
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
}
/*
Execute the command called
*/
module.exports = (bot,message) => {
  if(!message.content.startsWith(PREFIX) || message.author.bot) return;

  //all variables in one environnement call "env"
  const env = new Object()
  env.args = message.content.slice(PREFIX.length).split(/ +/);
  env.commandName = env.args.shift().toLowerCase();

  // in a game channel
  /*
  homonym commands from game rewrite the main commands
  */
  env.id = message.channel.id
  if(bot.gamesOngoing.has(env.id)) {
    env.game = bot.gamesOngoing.get(env.id);
    env.name = env.game.name;
    if(bot.commands.has(env.name)){
      if(bot.commands.get(env.name).has(env.commandName)){
        execute(bot,env,message)
        return;
        // bot.commands.get(env.name).get(command).execute(bot,game,message,args);
      }
    }
  }

    //in private channel
  /* forbiden for the moment because can't check which server is cuncern */
  /* Maybe check ig message is in the cache of game or before the command the name of the game or quote */
  // if(message.channel.type == "dm"){
  //   console.log("dm send");
  //   bot.gamesOngoing.forEach((item, i) => {
  //     const game = item;
  //     const name = item.name;
  //     if(bot.commands.get(name).has(commandName)){
  //       bot.commands.get(name).get(commandName).execute(bot,game,message,args);
  //     }
  //   });
  // }else{
  //   // console.log(message)
  // }

  // any channel
  env.name = "main"
  env.game = undefined;
  if(!bot.commands.get(env.name).has(env.commandName)) return;
  execute(bot,env,message)
  // bot.commands.get("main").get(commandName).execute(bot,undefined,message,args);
}