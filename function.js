const Discord = require(`discord.js`);
exports.Discord = Discord;

const fs = require(`fs`)
exports.fs = fs;

const displayText = function (client,name,context,key,lang){
  return client.jsonFiles.get(`text`)[context][key][lang]
}

exports.displayText = displayText;

// Auxiliary function to extract file name with the extension from directory. (boolean recursive)
var arrayOfFile = function (directory,extension,recursive) {
  let array = new Array(0);
  const allFiles =  fs.readdirSync(directory,{withFileTypes:true});
  for (const file of allFiles) {
    if(file.isDirectory() && recursive) {
      const path = directory + "/" + file.name
      array = array.concat(arrayOfFile(path,extension,recursive))
    }
    if(file.isFile() && file.name.endsWith(extension)) array.push(directory+"/"+file.name)
  }
  return array
}

exports.arrayOfFile = arrayOfFile;

var displayCommands = function(bot,message){
  bot.commands.forEach((k,v) => {
    message.channel.send(`\n=${v} function=`)
    bot.commands.get(v).forEach((obj,name) => {
      message.channel.send(`\`!${name}\``)
      message.channel.send(obj.description)
    });
  });
  return;
}

exports.displayCommands = displayCommands;
