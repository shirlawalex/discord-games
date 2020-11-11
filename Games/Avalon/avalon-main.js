const {fs, Discord } = require(`../../util/function.js`)

const {Role} = require("../Class/role.js")
const Games = require("../Class/games.js")
const nameGame = "Avalon"
const jsonFile = './Games/Avalon/avalon-text.json'
const jsonData = JSON.parse(fs.readFileSync("./Games/Avalon/data.json"));
module.exports  = class Avalon extends Role(Games) {    
 
  handleReaction(reaction,user){
    this.result = [];
    this.result = this.loadVote(reaction,this.arrayMsg,[`✅`,`❌`,`🏳️`,"🏴"],this.result);

     console.log(this.result.length)
    let nb0 = this.result.filter(e => e == 0).length
    console.log("nbre de 0:",nb0);

    let nb1 = this.result.filter(e => e == 1).length
    console.log("nbre de 1:",nb1);
    /*
      if(nbTrue >= result.length / 2){ //to do}
        //the cache is use for specific message or for message out of the channel
        const message = reaction.message;
        console.log("to do : handle reaction")
        if(this._cacheMessage.has(message.id)){
          console.log("in the cache : action for this message")
          console.log(message.content)
        }else{
          console.log("message not in the cache")
        }
      }
      */
    }

  static privateConstructor(bot,channel){
    return new Avalon(bot,channel)
  }

  constructor(bot,channel) {
    super(bot,nameGame,jsonFile,channel)
    this.roleLeft = Avalon.listRole;
  }
}
