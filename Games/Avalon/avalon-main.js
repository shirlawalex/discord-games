const { Discord, fs } = require(`./../../function.js`)
const Games = require("./../games.js")
const nameGame = "Avalon"
const jsonFile = './Games/Avalon/avalon-text.json'
const jsonBoard = JSON.parse(fs.readFileSync("./Games/Avalon/board.json"));


module.exports  = class Avalon extends Games {

  //////// Customized function

  static privateConstructor(channel){
    return new Avalon(channel)
  }

  constructor(channel) {
    super(nameGame,jsonFile,channel)
    // this.board = [(0,false),(0,false),(0,false),(0,false),(0,false)]
    this.board = jsonBoard["0"]
    this.round = 1;
    this.countRejected = 0;
    this.questSucceed = 0;
    this.questFailed = 0;
    this.players = new Map() // {id : [role, 'option role, ... ']}
  }

  static match(message) {
    // return (message.content == "Test")
    return true
  }

  static helloWorld (guild) {
    // guild.channels.cache.first.send('Hello World !')
    console.log("Hello World ! Avalon")
  }

  handleReaction(reaction,user){
    // if(reaction is pouce et messag est le bon ?)
    console.log("Avalon handle reaction")
  }

  action(){
    this.channel.then( channel => {
      channel.send(this.displayText("menu","welcome"))
      channel.send(this.displayText("menu","players"))
      console.log(this.board);
      // channel.send(this.displayText("menu","introduction"))
      // channel.send(this.displayText("menu","summary"))
      // channel.send(this.displayText("menu","goals"))
      // channel.send(this.displayText("menu","command"))
      let step = 0;
      switch (step) {
        case 0:
          break;
        case 1: // Logging players
          break;
        case 2: // Starting party
          break;
        case 3: // Sorting randomly players
          break;
        case 4: // give Role to players
          break;
        case 5: // New Leader
          break;
        case 6: // Leader start tour
          break;
        case 7: // Players vote
          break;
        case 8: // Majority of No : Quest doesnt go !
          break;
        case 9: // Majority of Yes : Quest go !
          break;
        case 10: // Quest Failed : 1 point for Evil
          break;
        case 11: // Quest Suceed : 1 point for Good
          break;
        case 12: // Number of Quest check
          break;
        case 13: // 3 in a row : Ends of Quest
          break;
        case 14: // Assassination of Merlin
          break;
        case 15: // Evil win
          break;
        case 16: // Good win
          break;
        case 17: // Credit
          break;
        case 18: //
          break;
        default:
          //this case is not implemented

      }
    }).catch(err => {
      console.error("cannot do action from avalon.js");
    })

  }

}
