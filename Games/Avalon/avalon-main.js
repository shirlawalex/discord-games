const { Discord, fs } = require(`./../../function.js`)
const Games = require("./../games.js")
const nameGame = "Avalon"
const jsonFile = './Games/Avalon/avalon-text.json'
const map  = JSON.parse(fs.readFileSync("./Games/Avalon/board.json"));
const jsonBoard = new Map(Object.entries(map))


console.log(jsonBoard.get("board"));



var displayBoard = function (game,board){
  let msg = "";
  let info = false;
  Object.values(board).forEach(val => {
    msg = msg + ":"+val[0]+":"
    if(val[1]) {msg = msg + ":pushpin:";info = true;}
  });
  game.channel.send(msg)
  if (info){
    game.channel.send(":four::pushpin: "+game.displayText("rules","roundPin"))
  }
}

var printBoard = function (game) {
  const nb = game.players.size.toString();
  game.channel.send("```" +game.displayText("players",nb)+ "```")
  game.board = jsonBoard["board"][nb]
  displayBoard(game,game.board)
  const msgDenied = "```" + game.countRejected +
  game.displayText("gameAction","countDenied") + "```";
  game.channel.send(msgDenied);
  return;
}

var role = function(game,nb){
  ret = []

  for (const [key, value] of Object.entries(jsonBoard.role)) {
    console.log(`${key}: ${value}`);
  }

  // game.channel.send(game.displayText("wsh"))
  // ret = jsonBoard["role"][]

}

module.exports  = class Avalon extends Games {

  //////// Customized function

  static privateConstructor(channel){
    return new Avalon(channel)
  }

  constructor(channel) {
    super(nameGame,jsonFile,channel)
    // this.board = [(0,false),(0,false),(0,false),(0,false),(0,false)]
    this.step = 0;
    this.board = jsonBoard["board"]["0"];
    this.round = 1;
    this.countRejected = 0;
    this.questSucceed = 0;
    this.questFailed = 0;
    this.players = new Map(); // {id : [role, 'option role, ... ']}
    this.order = [];
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
    this.promiseChannel.then( channel => {
      console.log("step is:",this.step)
      switch (this.step) {
        case 0:
          channel.send(this.displayText("menu","welcome"))
          channel.send(this.displayText("menu","players"))
          // channel.send(this.displayText("menu","introduction"))
          // channel.send(this.displayText("menu","summary"))
          // channel.send(this.displayText("menu","goals"))
          // channel.send(this.displayText("menu","command"))
          this.step = 1;
          console.log("step => 1");
          break;
        case 2: // Starting party
          /*
          !start to launch the game with the players already register
          */
        case 1: // Logging players
          /*
          !add @mention [@mention ...] to add one or sevreal players to the partie
          check if number of players is between 5 and 10
          */
          if(this.players.size >= 5 && this.players.size <= 10){
            this.step = 2;
            console.log("step => 2");
            const nb = this.players.size.toString()
            displayBoard(this,jsonBoard["board"][nb])
          }else{
            this.step = 1;
            console.log("step => 1");
          }
          break;
        case 3: // Sorting randomly players
          printBoard(this)
          this.players.forEach((k, v) => {
            this.order.push(v)
          });

          this.order.sort(function(){
            return 0.5-Math.random();
          })

          let msg = this.displayText("gameAction","leaderOrder")
          this.order.forEach((id) => {
            msg = msg + channel.members.get(id).user.username + "/n";
          });
          channel.send(msg)
          this.step = 4; //no break go direct to next step
        case 4: // give Role to players
          role(this,this.players.size)
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
      console.error(err)
    })

  }

}
