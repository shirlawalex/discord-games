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

module.exports  = class Avalon extends Games {

  //////// Customized function

  static privateConstructor(channel){
    return new Avalon(channel)
  }

  constructor(channel) {
    super(nameGame,jsonFile,channel)
    this.step = 0;
    this.round = 1;
    this.countDenied = 0;
    this.questSucceed = 0;
    this.questFailed = 0;
    this.assassination = true;
    this.players = new Map(); // {id : [role, 'option role, ... ']}
    this.quest = new Map(); // {id : boolean}
    this.order = [];
    this.leaderId = 0;
    this.vote = []; //[true,false,true] true : Yes, false : No.
    this.boardData = jsonData["board"]
    this.board = this.boardData["0"];
    this.roleMap = new Map(Object.entries(jsonData["role"]))
    // Create a role for leader of each round
    this.leaderRole;
    this.assassination = true;
  }

  handleReaction(reaction,user){
    const message = reaction.message;
    const id = message.author.id;

    if(this._cacheMessage.has(message.id)){
      if(this.step == 8){
        if(reaction.emoji.name == `✅` || reaction.emoji.name == `❌`){
          const index = this.order.indexOf(id);
          if(index != -1){
            if(this.vote[index] == undefined){
              if(reaction.emoji == `✅`) {this.vote[index] = true;}
              else {this.vote[index] = false;}
              this.action()
            }
            else{
              message.channel.send(this.displayText("gameAction","alreadyVote"))
              return;
            }
          }
        }
      }

      if(this.step == 11){
        console.log("🏳","all fail","🏴" ,"all succes")
        
        if(!this.quest.has(id)){
          console.log("not allowed");
          return;
        }

        if(this.quest.get(id) != undefined){
          message.channel.send(this.displayText("gameAction","alreadyVote"))
          return;
        }

        switch (reaction.emoji.name) {
          case "✅":
            this.quest.set(id,true);
            break;

          case "❌" :
            this.quest.set(id,false)
            break;

          case "🏳" :
            this.quest.forEach((v, k) => {
              this.quest.set(k,false)
            });
            break;

          case "🏴" :
            this.quest.forEach((v, k) => {
              this.quest.set(k,true)
            });
            break;

          default:
            console.log("emoji not allowed");
            return;
        }
        this.action()
      }
    }else{
      console.log("message not in the cache")
    }
  }

  action(){
    this.promiseChannel.then( channel => {
      console.log("step is:",this.step)
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
          const msg = channel.send(this.displayText("menu","goals"))
          // super.addCache(msg)
          // channel.send(this.displayText("menu","command"))
          this.step = 1;
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
            const nb = this.players.size.toString()
            // channel.send("```"+this.displayText("gameAction","board")+"```")
            // channel.send(this.displayText("gameAction","start"))
            // displayBoard(this,this.boardData[nb])
            this.step = 2;
          }else{
            this.step = 1;
          }
          break;

        case 3: // Sorting randomly players
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
          this.step = 4;

        case 4: // give Role to players
          channel.send(this.displayText("gameAction","selectRole"))
          displayRoles(this,this.players.size)
          this.leaderId = this.order.length - 1;
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
            this.step = 15;
            this.action()
            break;
            return;
          }

          //add next
          this.leaderId = (this.leaderId + 1)%this.order.length;
          channel.members.get(this.order[this.leaderId]).roles.add(this.leaderRole)

          printBoard(this)

          channel.send(this.displayText("gameAction","leader"))
          channel.send(channel.members.get(this.order[this.leaderId]).user.username)
          this.step = 6;

        case 6: // Leader start tour
          channel.send(this.displayText("gameAction","leaderChoose"))
          channel.send(this.displayText("gameAction","rejectedCount")+` ${this.countDenied}`)
          break;

        case 7: // Players vote
          this.vote = new Array(this.order.length)
          this.vote.fill(undefined)
          for(const i in this.order){
            const id = this.order[i]

            if(!this.channel.members.get(id).user.bot){
              const privateChan = this.channel.members.get(id);
              const txt = "```"+this.displayText("log","game") + this.channel.name+"```";

              const msg1 = privateChan.send(txt)
              const msgVote = privateChan.send(this.displayText("gameAction","privateVoteEmoji"))
              msgVote.then(m => {
                m.react(`✅`);
                m.react(`❌`)
              })
              super.addCache(msgVote);
            }
          }
          this.step = 8;

        case 8: //check if everybody has vote
          const max = this.order.length;
          // const nb = this.game(e => e != undefined).length
          const nb = this.vote.filter(e => e == true || e == false).length
          channel.send(nb+this.displayText("gameAction","voteCheck")+max)
          if(nb == max){
            let yes = 0;
            let no = 0;
            for(const i in this.vote){
              if(this.vote[i]) {yes ++;}
              else {no ++;}
            }
            const txt = `yes: ${yes}, no: ${no}`;
            channel.send(txt);
            if(yes > no) this.step = 10;
            else this.step = 9;
            this.action()
          }
          break;

        case 9: // Majority of No : Quest doesnt go !
          this.step = 5;
          this.countDenied ++;
          channel.send(this.displayText("gameAction","noWin"))
          channel.send(this.displayText("gameAction","teamDenied"))
          this.action()
          break;

        case 10: // Majority of Yes : Quest go !
          this.countDenied = 0;
          channel.send(this.displayText("gameAction","yesWin"))
          channel.send(this.displayText("gameAction","teamAccept"))

          this.quest.forEach((vote, id) => {
            const privateChan = this.channel.members.get(id);
            if(!privateChan.user.bot){
              const msgVote = privateChan.send(this.displayText("private","questEmoji"))
              msgVote.then(m => {
                m.react(`✅`);
                m.react(`❌`)
              })
              super.addCache(msgVote);
            }
          });

          this.step = 11;
          break;
        case 11: // check everybody vote
          let check = true;
          this.quest.forEach((item, i) => {
            if(item != true && item != false){
              check = false;
            }
          });

          // for( v of this.quest){
          //   // if(v == undefined) check = false;
          //   if(v != true || v != false){
          //     check = false;
          //   }
          // }

          channel.send(this.displayText("gameAction","voteQuest"));

          if(check == false){
            break;
            return;
          }

          let countFail = 0;
          this.quest.forEach((item, i) => {
            if(item == false){
              countFail ++;
            }
          });

          // for(v of this.quest){
          //   if(v == false){
          //     countFail ++;
          //   }
          // }
          let fail = false
          if(this.board[this.round][1] == true){
            fail = (countFail >= 2)
          }else{
            fail = (countFail >= 1)
          }
          channel.send(countFail+this.displayText("gameAction","countFail"))
          if(fail){
            this.step = 12;
          }else{
            this.step = 13;
          }

        case 12: // Quest Failed : 1 point for Evil
        case 13: // Quest Suceed : 1 point for Good
          let emoji = "warning";
          if(this.step == 12){
            this.questFailed ++;
            emoji = "x"
            channel.send(this.displayText("gameAction","questFailed"))
          }

          if(this.step == 13){
            this.questSucceed ++;
            emoji = "white_check_mark"
            channel.send(this.displayText("gameAction","questSucceed"))
          }

          // Number of Quest check
          this.board[this.round.toString()][0] = emoji;
          // console.log("quest Succeed",this.questSucceed)
          // console.log("quest Failed",this.questFailed)
          if (this.questSucceed >= 3){
            this.step = 14
            this.action()
            return;
          }
          if( this.questFailed >= 3){
            this.step = 15
            this.action()
            return;
          }

          this.round ++;
          this.step = 5;
          this.action();
          break;

        case 14: // Assassination of Merlin
          if(this.assassination){
            channel.send(this.displayText("gameAction","assassination"))
            channel.send(this.displayText("gameAction","assassinationCommand"))

          }else{
            this.step = 16;
            this.action()
          }
          break;

        case 15: // Evil win
        case 16: // Good win

        if(this.step == 15){
          channel.send(this.displayText("gameAction","evilWin"))
        }

        if(this.step == 16){
          channel.send(this.displayText("gameAction","goodWin"))
        }

        case 17: // Reveal role
          this.players.forEach((item, i) => {
            const name = message.channel.members.get(i).user.username;
            const txt = name + " : "+item.toString()
            message.channel.send(txt)
          });
        case 18: // Credit
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
