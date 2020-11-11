const { Discord } = require(`../util/function.js`)
const config = require(`../config.json`);
const { launcher } = require("../util/loader.js")


//When User react to a Emoji
/*
Start a new game
check if it`s not the Bot that react to the message
*/
// {bot.on`messageReactionAdd`, (reaction, user) => {
module.exports = async (bot,reaction,user) =>  {
  const message = reaction.message;
  const idChannel = message.channel.id;
  const guild = message.guild;
  const parent = message.channel.parent;
  // const member = message.guild.members.get(user.id)
  if(user.bot) return;

  // Parse by channel, first the Main Channel
  if(guild != null){
    const settings = await bot.getGuild(guild);

    if(idChannel === settings.idMainChannel){
    // Emoji to start new games

    const listGamesMessage = settings.listGamesMessage;
    if(listGamesMessage.has(message.id)){
      const name = listGamesMessage.get(message.id);
      newGame = launcher(bot,parent,name);
      if(newGame !== undefined){
        newGame.promiseChannel.then( async channel => {
          // add to the Map of the Game Channel
          bot.gamesOngoing.set(channel.id,newGame)

          //Add to the DB 
          const newGameBD = {
            guildID : guild.id,
            guildName: guild.name,
            gameName: name,
            channelID : channel.id,
            default : false
          };

          await bot.saveGame(newGameBD);
          await newGame.setNewMainMsg();
          newGame.introduction();
        const msg = bot.displayText(`text`,bot.main,"channelCreated",settings.lang) +" <#"+ newGame.channel.id +">"
        bot.send(message.channel,msg);
      });
      }else{
        console.log("game undefined");
      }
      reaction.remove();
      message.react(`🆕`);
      return;
    }
  }
}else{
    // handle a reaction in a Game channel
    if (bot.gamesOngoing.has(idChannel)){
      bot.gamesOngoing.get(idChannel).handleReaction(reaction,user)
    }

    // handle reaction in private channel
    if ( message.channel.type == "dm" ){
        console.log("emoji detected on private/dm msg");
        bot.gamesOngoing.forEach((item, i) => {
          const game = item
          const name = game.name
          const cache = game.cache

          if(cache.has(message.id)){
            game.handleReaction(reaction,user)
          }else{
            console.log("not in cache")
          }
      });
    }
  }
}