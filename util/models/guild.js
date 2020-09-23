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
  ,idMainChannel: {
    "type": String,
    "default": defaults.idMainChannel
  }
  ,nameParentChannel: {
    "type": String,
    "default": defaults.nameParentChannel
  }
  ,nameMainChannel: {
    "type": String,
    "default": defaults.nameMainChannel
  }
});

module.exports = mongoose.model("Guild",guildSchema);