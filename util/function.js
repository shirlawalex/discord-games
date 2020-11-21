const Discord = require(`discord.js`);
exports.Discord = Discord;

const fs = require(`fs`)
exports.fs = fs;




/*********  FUNCTION ***********/

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



var commandAllow = function(game,settings,name,curStep) {
  //check if the commands is call while curStep
  if(!curStep.includes(game.step)){
    const msg = `"${name}" : ${game.bot.displayText("text","log","forbiden",settings.game.lang)}`;
    game.send(msg);
    return false;
  }
  return true;
}

exports.commandAllow = commandAllow;
