const { Discord, fs } = require(`./../../function.js`)
const Games = require("./../games.js")
const nameGame = "Avalon"
const jsonFile = './Games/Avalon/avalon-text.json'
const jsonData = JSON.parse(fs.readFileSync("./Games/Avalon/data.json"));

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

var displayRoles = function(game,nb){
  ret = []
  // game.channel.send()
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

  // game.channel.send(game.displayText("wsh"))
  // ret = jsonBoard["role"][]

}
// selectRoles(undefined,5);

module.exports  = class Avalon extends Games {

  //////// Customized function

  static privateConstructor(channel){
    return new Avalon(channel)
  }

  constructor(channel) {
    super(nameGame,jsonFile,channel)
    // this.board = [(0,false),(0,false),(0,false),(0,false),(0,false)]
    this.step = 0;
    this.round = 1;
    this.countDenied = 0;
    this.questSucceed = 0;
    this.questFailed = 0;
    this.assassination = true;
    this.players = new Map(); // {id : [role, 'option role, ... ']}
    this.order = [];
    this.leaderId = 0;
    this.vote = []; //[true,false,true] true : Yes, false : No.
    this.boardData = jsonData["board"]
    this.board = this.boardData["0"];
    this.roleMap = new Map(Object.entries(jsonData["role"]))
    // Create a role for leader of each round
    this.leaderRole;
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

      // console.log("step is:",this.step)
      switch (this.step) {
        case 0:
        // Create a role for leader of each round
        //creation of the role
        super.channel.guild.roles.create({
          data: {
            name: `Leader of ${channel.name}`,
            color: 'YELLOW',
          },
          reason: 'because',
        })
        .then( role => {
          this.leaderRole = role.id;
        })
        .catch(console.error);
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
          channel.send("```"+this.displayText("gameAction","board")+"```")
          displayBoard(this,this.boardData[nb])
        }else{
          this.step = 1;
          console.log("step => 1");
        }
        break;
        case 3: // Sorting randomly players
        printBoard(this)
        this.order = []
        this.players.forEach((k, v) => {
          this.order.push(v)
        });

        this.order.sort(function(){
          return 0.5-Math.random();
        })

        channel.send(this.displayText("gameAction","leaderOrder"))
        let i = 1;
        this.order.forEach((id) => {
          const msg = i+": "+channel.members.get(id).user.username;
          i++;
          channel.send(msg)
        });
        this.step = 4; //no break go direct to next step
        case 4: // give Role to players
        channel.send(this.displayText("gameAction","selectRole"))
        displayRoles(this,this.players.size)
        break;
        case 5: // New Leader
        //clean
        for(const i in this.order){
          const userRoles = channel.members.get(this.order[i]).roles
          if(userRoles.cache.has(this.leaderRole)){
            userRoles.remove(this.leaderRole)
          }
        }
        if(this.countDenied == 5){
          this.step = 10;
          this.gameAction()
          break;
          return;
        }

        //add next
        if(this.round == 1 && this.countDenied == 0 && this.leaderId == 0){
          // this.players.get(this.order[0])
          channel.members.get(this.order[0]).roles.add(this.leaderRole)
        }else{
          this.leaderId = (this.leaderId + 1)%this.order.length;
          channel.members.get(this.order[this.leaderId]).roles.add(this.leaderRole)
        }

        channel.send(this.displayText("gameAction","leader"))
        channel.send(channel.members.get(this.order[this.leaderId]).user.username)
        this.step = 6;
        case 6: // Leader start tour
        channel.send(this.displayText("gameAction","leaderChoose"))
        break;
        case 7: // Players vote


        break;
        case 8: // Majority of No : Quest doesnt go !
        this.step = 5;
        this.countDenied ++;
        channel.send(this.displayText("gameAction","noWin"))
        this.action()
        break;
        case 9: // Majority of Yes : Quest go !
        this.countDenied = 0;
        //TO DO

        break;
        case 10: // Quest Failed : 1 point for Evil
        case 11: // Quest Suceed : 1 point for Good
        if(this.step == 10){
          channel.send(this.displayText("gameAction","questFailed"))
          this.questFailed ++;
        }

        if(this.step == 11){
          channel.send(this.displayText("gameAction","questSucceed"))
          this.questSucceed ++;
        }
        this.step = 12;
        case 12: // Number of Quest check

        if (this.questSucceed >= 3){
          this.case = 14
          this.action()
          break;
          return;
        }
        if( this.questFailed >= 3){
          this.step = 15
          this.action()
          break;
          return;
        }

        this.round ++;
        this.step = 5;
        this.action();
        break;
        case 14: // Assassination of Merlin
        if(assassination){
          channel.send(this.displayText("gameAction","assassination"))
          channel.send(this.displayText("gameAction","assassination"))
        }else{
          this.step = 16;
          this.action()
        }
        break;
        case 15: // Evil win
        channel.send(this.displayText("gameAction","evilWin"))
        break;
        case 16: // Good win
        channel.send(this.displayText("gameAction","goodWin"))
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
