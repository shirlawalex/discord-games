const config = require(`../config.json`);
const { commands } = require("../Games/Avalon/avalon-commands");

//When User send a message

var execute = (bot,env,message,settings) => {
  const args = env.args ;
  const id = env.id ;
  const commandName = env.commandName ;
  const game = env.game ;
  const name = env.name ;

  const command = bot.commands.get(name).get(commandName);

  if((command.type == "cheat" || command.type == "admin") && message.author.id != '589664124032778250'){  
    const txt = `${bot.displayText("text","log","notallowed",settings.lang)}`;
    message.channel.send(txt);
    return ;
  }

  if(command.args && args.length == 0){
    if(command.default == undefined || command.default == ""){
      const txt = `${bot.displayText("text","log","usage",settings.lang)} Usage: \`${settings.prefix}${command.name} ${command.usage}\``;
      message.channel.send(txt);
      return;
    }else{
      
      const txt = ` ${bot.displayText("text","log","defaultArg",settings.lang)} ${command.default}. \nUsage : \`${settings.prefix}${command.name} ${command.usage}\``;
      message.channel.send(txt);
      args[0] = command.default;
    }
  }
  command.execute(bot,game,message,args,settings);

  if(command.delete != undefined && command.delete){
    message.delete({timeout : 10000}).then(msg => console.log(`Deleted message from ${msg.author.username} after 10 seconds.`)).catch(console.error);
  }
}
/*
Execute the command called
*/
module.exports = async (bot,message) => {
  //if dm send to the event private dm
  if(message.channel.type === "dm") return bot.emit("directMessage",message);
  const settings = await bot.getGuild(message.guild)

  if(!message.content.startsWith(settings.prefix) || message.author.bot) return;

  //all variables in one environnement call "env"
  const env = new Object()
  env.args = message.content.slice(settings.prefix.length).split(/ +/);
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
        execute(bot,env,message,settings)
        return;
        // bot.commands.get(env.name).get(command).execute(bot,game,message,args);
      }
    }
  }

  // any channel
  env.name = 'main'
  env.game = undefined;
  if(!bot.commands.get(env.name).has(env.commandName)) return;
  execute(bot,env,message,settings)
  // bot.commands.get('main').get(commandName).execute(bot,undefined,message,args);
}