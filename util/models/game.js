const mongoose = require("mongoose");
const { DEFAULTSETTINGS : defaults} = require("../../config.json")

const gameSchema = mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  guildID : String,
  guildName : String,
  gameName : String,
  channelID : Number
  ,prefix: {
    "type" : String,
    "default": defaults.prefix
  }
  ,lang: {
    "type": String,
    "default": defaults.lang
  }
  ,listGamesMessage: {
    "type": Map,
    "of" : String,
    "default": {}
  }
});

module.exports = mongoose.model("Game",gameSchema);