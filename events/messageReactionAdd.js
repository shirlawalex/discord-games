const { Discord } = require(`../util/function.js`)
const config = require(`../config.json`);
const Games = require(`../listGames.js`);


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

  const settings = await bot.getGuild(guild);
  console.log(idChannel,settings.idMainChannel)
  // Parse by channel, first the Main Channel
  if(idChannel === settings.idMainChannel){
    console.log("test")

    // Emoji to start new games
    if(bot.listGamesMessage.has(message.id)){
      newGame = Games.launcher(bot,parent,bot.listGamesMessage.get(message.id));
      if(newGame !== undefined){
        newGame.promiseChannel.then( channel => {
          // add to the Map of the Game Channel
          bot.gamesOngoing.set(channel.id,newGame)
          newGame.action();
        const msg = bot.displayText(`text`,bot.main,"channelCreated",settings.lang) +" <#"+ newGame.channel.id +">"
        message.channel.send(msg);
      });
      }else{
        console.log("game undefined");
      }
      reaction.remove();
      message.react(`🆕`);
      return;
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