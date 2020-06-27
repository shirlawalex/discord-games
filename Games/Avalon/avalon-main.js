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
    }).catch(err => {
      console.error("cannot do action from avalon.js");
    })

  }

}
