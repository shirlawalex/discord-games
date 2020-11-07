const mongoose = require("mongoose");
const { DEFAULTSETTINGS : defaults} = require("../../config.json")

const guildSchema = mongoose.Schema({
  _id : mongoose.Schema.Types.ObjectId,
  guildID : String,
  guildName : String
  ,prefix: {
    "type" : String,
    "default": defaults.prefix
  }
  ,lang: {
    "type": String,
    "default": defaults.lang
  }
  ,nameMainChannel: {
    "type": String,
    "default": defaults.nameMainChannel
  }
  ,idMainChannel: {
    "type": String,
    "default": defaults.idMainChannel
  }
  ,nameLogChannel: {
    "type": String,
    "default": defaults.nameLogChannel
  }
  ,idLogChannel: {
    "type": String,
    "default": defaults.idLogChannel
  }
  ,nameParentChannel: {
    "type": String,
    "default": defaults.nameParentChannel
  }
  ,listGamesMessage: {
    "type": Map,
    "of" : String,
    "default": {}
  }
});

module.exports = mongoose.model("Guild",guildSchema);