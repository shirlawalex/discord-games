

const Discord = require(`discord.js`);
exports.Discord = Discord;

const fs = require(`fs`)
exports.fs = fs;


const mongoose = require("mongoose");
const config = require("../config.json");
const { DEFAULTSETTINGS : defaults} = require("../config.json");
const { Guild } = require("./models/index");


/* to launch these function: 

require("./util/test")(bot);
bot.testlog()
bot.guildName("test")

*/


module.exports = bot => {
  // Initialisation and new Proprieties

  bot.jsonFiles = new Discord.Collection(), //;
  bot.commands = new Map(), //; //Map each key is for a game
  bot.defaultSettings = defaults,
 
  //Connection to the DataBase
  bot.mongoose = require("./mongoose");
  bot.dblocal = false;
  
  // Constantes
  bot.main = `main`,
  bot.nameMainChannel = `presentation-channel`,
  
  // Collection of Data
  bot.listGamesMessage = new Map(), //Map of games launcher { message.id : `name` }
  bot.gamesOngoing = new Map(), // Map of the games ongoing { channel.id : Object Game }
  
  

  /*********  FUNCTION ***********/

  bot.testlog = () => {
    console.log("test done");
  },

  bot.displayText = (name,context,key,lang) =>{
    return bot.jsonFiles.get(name)[context][key][lang]
  },

  // Display in the channel of the message all commands
  bot.displayCommands = (message) => {
    bot.commands.forEach((k,v) => {
      message.channel.send(`\n\`\`\`${v} commands\`\`\``)
      bot.commands.get(v).forEach((obj,name) => {
        message.channel.send(`\`!${name}\``)
        message.channel.send(obj.description)
      });
    });
    return;
  }

  
  bot.isSaved = async (guild) => {
    const data = await Guild.findOne({guildID: guild.id});
    return data ? true : false ;
  },

  bot.saveGuild = async (newGuild) => {
    const merged = Object.assign({_id:mongoose.Types.ObjectId()},newGuild);   //all information in one const
    
    //check if already in DB
    const data = await Guild.findOne({guildID: newGuild.guildID});
    if(data){console.log("guild already in db"); return data;} 

    const createGuild = await new Guild(merged);
    createGuild.save().then(g => console.log(`New guild -> ${g.guildName}`));
    return createGuild;
  },
  
  
  bot.getGuild = async (guild) => {
    const data = await Guild.findOne({guildID: guild.id});
    if(data) return data;
    return bot.defaultSettings;
  },


  /* to change data
    await bot.updateGuild(guild,{ key1 : new_value, key2 : new_value})
  */
  bot.updateGuild = async (guild,settings) => {
    const data = await Guild.findOne({guildID: guild.id});
  
    if(!await bot.isSaved(guild)){ 
      console.log("couldnt find data in DB"); return false;
    }

    
    if(typeof data !== "object") data = {};
    for (const key in settings){
      if (data[key] !== settings[key])  data[key] = settings[key];
    }
    return data.updateOne(settings);
  }
}


