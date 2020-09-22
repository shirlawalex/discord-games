const Discord = require(`discord.js`);
exports.Discord = Discord;

const fs = require(`fs`)
exports.fs = fs;


const mongoose = require("mongoose");
const { DEFAULTSETTINGS : defaults} = require("../config.json");
const { Guild } = require("../models/index");


/*********  FUNCTION ***********/

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



