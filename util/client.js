

const Discord = require(`discord.js`);
exports.Discord = Discord;

const fs = require(`fs`)
exports.fs = fs;


const mongoose = require("mongoose");
const config = require("../config.json");
const { DEFAULTSETTINGS : defaults} = require("../config.json");
const { Guild, Game } = require("./models/index");


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
  
  // Collection of Data
  bot.listGamesMessage = new Map(), //Map of games launcher { message.id : `name` }
  bot.gamesOngoing = new Map(), // Map of the games ongoing { channel.id : Object Game }
  
  

  /*********  FUNCTION ***********/


  bot.send =  (channel,content) => {
    bot.sendLog(channel.guild,content);
    return channel.send(content);
  },

  bot.sendLog = async (guild,content) => {
    const data = await Guild.findOne({guildID: guild.id});
    const logChannel = guild.channels.cache.get(data.idLogChannel);
    logChannel.send(content);
  },

  bot.displayText = (name,context,key,lang) =>{
    return bot.jsonFiles.get(name)[context][key][lang]
  },

  // Display in the channel of the message all commands
  bot.displayCommands = (message,nameGame,nameCommand,settings) => {
    let end = true;
    let noArg =  nameGame == "main" ? true : false ;
    let nameContext = nameGame == "main" ?  `${bot.displayText(`text`,"commandHelp",`nameMain`,settings.lang)}` : nameGame;

    bot.commands.forEach((k,v) => {
      if(String(v).toLowerCase() === String(nameGame).toLowerCase()){
        const commandMap = bot.commands.get(v); 

        let doContinu = true;
        if(nameCommand != ""){
          if(!commandMap.has(nameCommand)){
            bot.send(message.channel,
              `${bot.displayText(`text`,"commandHelp",`notFound`,settings.lang)}`);
          }else{
            doContinu = false;
            const command = commandMap.get(nameCommand);
            const embed = new Discord.MessageEmbed()
            .setColor("#DC143C")
            .setTitle(`Command : ${command.name} `)
            .setDescription(command.description);

            // console.log(command)
            const keys = Object.keys(command);

            keys.forEach(n => {
              if(n != "description" && n != "execute"){
                embed.addField(n,command[n] == "" ? "undefined" : command[n] )
              }
            });

            bot.send(message.channel,embed); 
          }
        }

        if(doContinu){
          //Display all commands from the game by categories
          const categories = new Map();

          commandMap.forEach((obj,name) => {
            const type = obj.type
              if(categories.has(type)){
                const cur = categories.get(type)
                cur[cur.length] = settings.prefix+name
                categories.set(type,cur)
              }else{
                const object = new Array(settings.prefix+name); //can put an Array, I don't know why. It transforms into an Object.
                categories.set(type,object);
              }
          });

          const embed = new Discord.MessageEmbed()
            .setColor("#DC143C")
            .setTitle("Commands")
            .setDescription(`${bot.displayText(`text`,"commandHelp",`listPt1`,settings.lang)} ${nameContext} ${bot.displayText(`text`,"commandHelp",`listPt2`,settings.lang)}`);
          
          categories.forEach((commandList,type) => {
            const nameList = Array.prototype.join.call(commandList);
            embed.addField(type,commandList)
          });
      
          bot.send(message.channel,embed); 
        }
      end = false; //no need to check other game
      }
    });
    if(end || noArg){ 
      // bot.send(message.channel,`${bot.displayText(`text`,"commandHelp",`gameNotFound`,settings.lang)}`);
      let map = Array.from(bot.commands);
      let names = Array.from(map,x => x[0]).join(", ")
      bot.send(message.channel,`${bot.displayText(`text`,"commandHelp",`listGamesPt1`,settings.lang)}  \`${names}\`${bot.displayText(`text`,"commandHelp",`listGamesPt2`,settings.lang)}`);
    }
  },

  //** ACCESS TO DATA BASE **/
  //GUILD 

  bot.isSaved = async (guild) => {
    const data = await Guild.findOne({guildID: guild.id});
    return data ? true : false ;
  },

  bot.saveGuild = async (newGuild) => {
    const merged = Object.assign({_id:mongoose.Types.ObjectId()},newGuild);   //all information in one const
    
    //check if already in DB
    const data = await Guild.findOne({guildID: newGuild.guildID});
    if(data){console.log("guild already in db"); return data;} 

    const createGuild = new Guild(merged);
    await createGuild.save().then(g => console.log(`New guild -> ${g.guildName}`));
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
  },

  //GAMES

  bot.setListGames = async (guild,key,value) => {
    const data = await Guild.findOne({guildID: guild.id});
    await data.listGamesMessage.set(key,value)
    await data.save();
    return data.listGamesMessage;
  },

  bot.getListGames = async (guild,key) => {
    const data = await Guild.findOne({guildID: guild.id});
    return data.listGamesMessage.get(key);
  },

  bot.hasListGames = async (guild,key) => {
    const data = await Guild.findOne({guildID: guild.id});
    return data.listGamesMessage.has(key);
  },

  bot.clearlistGames = async (guild) => {
    const data = await Guild.findOne({guildID: guild.id});
    data.listGamesMessage.forEach((v,k,m) => { m.delete(k); })
    // await data.listGamesMessage.clear()
    await data.save();
    return data.updateOne(data);
  },

  /* Game function */
  bot.saveGame = async (newGame) => {
    const merged = Object.assign({_id:mongoose.Types.ObjectId()},newGame);   //all information in one const
    
    //check if already in DB
    const data = await Game.findOne({guildID: newGame.guildID,channelID: newGame.channelID});
    if(data){console.log("game already in db"); return data;} 

    const createGame = new Game(merged);
    await createGame.save().then(g => console.log(`New game -> ${g.gameName} in ${g.guildName}`));
    return createGame;
  },

  bot.deleteGame = async (channelID) => {
    const res = await Game.deleteOne({channelID: channelID}).then( res => {console.log(`Game in channel ${channelID} deleted : ${res.n == 1 ? "ok":res.n + " documents deleted"}`)});

  },

  bot.isSavedGame = async (channelId) => {
    const data = await Game.findOne({ channelID: channelId});
    return data ? true : false ;
  },


  bot.getGame = async (channelId) => {
    const data = await Game.findOne({ channelID: channelId});
    if(data) return data;
    return bot.defaultSettings;
  },


  /* to change data
    await bot.updateGame(channelId,{ key1 : new_value, key2 : new_value})
  */
  bot.updateGame = async (channelId,settings) => {
    const data = await Game.findOne({ channelID: channelId});
  
    if(!await bot.isSavedGame(channelId)){ 
      console.log("couldnt find data in DB"); return false;
    }

    
    if(typeof data !== "object") data = {};
    for (const key in settings){
      if (data[key] !== settings[key])  data[key] = settings[key];
    }
    return data.updateOne(settings);
  }

   
  bot.setGamesMap = async (channelId,key,value) => {
    const data = await Game.findOne({channelID: channelId});
    await data.map.set(key,value)
    await data.save();
    return data.map;
  },

  bot.getGamesMap = async (channelId,key) => {
    const data = await Game.findOne({ channelID: channelId});
    return data.map.get(key);
  },

  bot.hasGamesMap = async (channelId,key) => {
    const data = await Game.findOne({ channelID: channelId});
    return data.map.has(key);
  },

  bot.clearGamesMap = async (channelId) => {
    const data = await Game.findOne({ channelID: channelId});
    data.map.forEach((v,k,m) => { m.delete(k); })
    // await data.listGamesMessage.clear()
    await data.save();
    return data.updateOne(data);
  }
  
}


