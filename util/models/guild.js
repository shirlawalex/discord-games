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
  },
  logActivate : {
    "type": Boolean,
    "default": defaults.logActivate
  }
  ,nameParentChannel: {
    "type": String,
    "default": defaults.nameParentChannel
  }
  ,idParentChannel: {
    "type": String,
    "default": defaults.idParentChannel
  }
  ,listGamesMessage: {
    "type": Map,
    "of" : String,
    "default": {}
  }
});

module.exports = mongoose.model("Guild",guildSchema);