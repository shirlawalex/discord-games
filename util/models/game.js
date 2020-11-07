const mongoose = require("mongoose");
const { DEFAULTSETTINGS : defaults} = require("../../config.json")

const gameSchema = mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  guildID : String,
  guildName : String,
  gameName : String,
  channelID : Number,
  mainMsgId : {
    "type": String,
    "default": defaults.mainMsgId
  }
  ,prefix: {
    "type" : String,
    "default": defaults.prefix
  }
  ,lang: {
    "type": String,
    "default": defaults.lang
  }
  ,map: {
    "type": Map,
    "of" : String,
    "default": {}
  }
});

module.exports = mongoose.model("Game",gameSchema);