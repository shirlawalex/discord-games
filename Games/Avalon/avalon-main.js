const {fs, Discord } = require(`../../util/function.js`)

const Games = require("./../games.js")
const nameGame = "Avalon"
const jsonFile = './Games/Avalon/avalon-text.json'
const jsonData = JSON.parse(fs.readFileSync("./Games/Avalon/data.json"));
module.exports  = class Avalon extends Games {

  static privateConstructor(bot,channel){
    return new Avalon(bot,channel)
  }

  constructor(bot,channel) {
    super(bot,nameGame,jsonFile,channel)
  }
}
