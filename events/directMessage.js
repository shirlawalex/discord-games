
module.exports = (bot,message) => {
  if(message.author.bot) return;

  console.log("PRIVATE MESSAGE IS NOT IMPLETENDED YET.")
  console.log(message.content);

  if(!message.content.startsWith(bot.defaultSettings.prefix)) return;

  //all variables in one environnement call "env"
  const env = new Object()
  env.args = message.content.slice(bot.defaultSettings.prefix.length).split(/ +/);
  env.commandName = env.args.shift().toLowerCase();
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

