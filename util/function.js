const Discord = require(`discord.js`);
exports.Discord = Discord;

const fs = require(`fs`)
exports.fs = fs;

const displayTextMain = function (client,name,context,key,lang){
  return client.jsonFiles.get(name)[context][key][lang]
}

exports.displayText = displayTextMain;

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

// Display in the channel of the message all commands
var displayCommands = function(bot,message){
  bot.commands.forEach((k,v) => {
    message.channel.send(`\n\`\`\`${v} commands\`\`\``)
    bot.commands.get(v).forEach((obj,name) => {
      message.channel.send(`\`!${name}\``)
      message.channel.send(obj.description)
    });
  });
  return;
}

exports.displayCommands = displayCommands;


var displayBoard = function (game,board){
  let msg = "";
  let info = false;
  Object.values(board).forEach(val => {
    msg = msg + ":"+val[0]+":"
    if(val[1]) {msg = msg + ":pushpin:";info = true;}
  });
  game.channel.send(msg)
  if (info){
    game.channel.send("\":four::pushpin:\" "+game.displayText("rules","roundPin"))
  }
}

exports.displayBoard = displayBoard;


var printBoard = function (game) {
  const nb = game.players.size.toString();
  game.channel.send("```" +game.displayText("players",nb)+ "```")
  game.board = game.boardData[nb]
  displayBoard(game,game.board)
  const msgDenied = "```" + game.countDenied +
  game.displayText("gameAction","countDenied") + "```";
  game.channel.send(msgDenied);
  return;
}

exports.printBoard = printBoard;


var displayRoles = function(game,nb){
  ret = []
  game.roleMap.forEach((value,key) => {
    if(key.startsWith(nb.toString())){
      let txt = "```"
      txt += `Config "${key}":\n`
      for(i in value){
        txt += `[${value[i]}]`
        if(i!=value.length){
          txt += ","
        }
      }
      txt += "```"
      game.channel.send(txt);
    }
  });
}

exports.displayRoles = displayRoles;
