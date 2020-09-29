const { Discord } = require(`../util/function.js`)
const config = require(`../config.json`);


//When User react to a Emoji
/*
Start a new game
check if it`s not the Bot that react to the message
*/
// {bot.on`messageReactionAdd`, (reaction, user) => {
module.exports = async (bot,channel) =>  {
  bot.deleteGame(channel.id)
  // bot.deleteGame(String(channel.id))
}