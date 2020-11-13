const {fs, Discord } = require(`../../util/function.js`)
const AvalonPlayer = require("./avalon-util/avalonPlayer.js")
const Games = require("../Class/games.js")
const {displayRoles } = require(`./avalon-util/avalonFunction.js`)


const nameGame = "Avalon"
const jsonFile = './Games/Avalon/avalon-text.json'
const jsonData = JSON.parse(fs.readFileSync("./Games/Avalon/avalon-util/data.json"));
module.exports  = class Avalon extends Games {    
 
  
  handleReaction(reaction,user){
    const message = reaction.message;
    const id = reaction.users.cache.find(e => e.id != message.author.id).id;

    if(this.step == 4){
      AvalonPlayer.setConfigRole(this,reaction);
    }
     if(this._cacheMessage.has(message.id)){
      if(this.step == 8){
        this.resultVote = this.loadVote(reaction,this.arrayVoteMsgId,[`✅`,`❌`],this.resultVote);
        console.log(this.resultVote);
        // if(!this.resultVote.includes(undefined)){
          this.action();
        // }
      }

      if(this.step == 11){
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

          case "🏳️" :
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
    let on = async (channel) => {
      console.log("step is:",this.step)
      switch (this.step) {
        case 0: //Initialisation
          /* 
          //* Create a role for leader of each round
          //* creation of the role
          //* bad idea
          channel.guild.roles.create({
            data: {
              name: `Leader of ${channel.name}`,
              color: 'YELLOW',
              discordGameRole : true,
              more : "true"
            },
            reason: 'because',
          })
          .then( role => {
            this.leaderRole = role.id;
          })
          .catch(console.error);
          */

          // let txt = this.displayText("menu","welcome")
          // + this.displayText("menu","players")
          // + this.displayText("menu","goals");
          
          const embedRule = this.mainEmbed;
          embedRule.addField("Présentation",this.displayText("menu","welcome"));
          embedRule.addField("Enregistrement joueurs",this.displayText("menu","players"));
          embedRule.addField("Objectif",this.displayText("menu","goals"));
          await this.send(embedRule,false);
          embedRule.spliceFields(0,3);
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
            this.step = 2;
          }else{
            this.step = 1;
          }
          break;
        case 3:  // Sorting randomly players
          const mainMsg = await this.setNewMainMsg();
          await this.send("GAME START",this.edit);

          this.order = AvalonPlayer.randomizeOrder(this.players);
          let msg = this.displayText("gameAction","leaderOrder")+"\n";
          for(let i = 1;i<=this.order.length;i++){
            msg += `${i}: ${channel.members.get(this.order[i-1]).toString()}\n`;
          }
          this.send(msg,this.edit);
          this.step = 4;
          
        case 4: // Select Role to play 
          AvalonPlayer.displayRole(this);

          this.leaderId = this.order.length - 1;
          break;

        case 5: // New Leader
          
          if(this.countDenied == 5){
            this.step = 15;
            this.action()
            break;
          }

          //add next
          this.leaderId = (this.leaderId + 1)%this.order.length;
          this.step = 6;

        case 6: // Leader start tour
          const embedGame = this.embedNewRound();
          embedGame.addField("Prochain action",this.displayText("gameAction","leaderChoose")) 
          await channel.send(embedGame,false);
          await embedGame.spliceFields(0,5);
          break;

        case 7: // Players vote
         
          let content1 = new Discord.MessageEmbed()
          .setTitle("Vote pour la quête")
          .setDescription(this.displayText("log","game") + this.channel.name)
          .addField("Joueurs selectionné pour la quête",this.namesQuest)
          .addField("Consigne",this.displayText("gameAction","privateVoteEmoji"));

          const arrayUser1 = Array.from(this.players.values());
          this.arrayVoteMsgId = await this.vote(arrayUser1,content1);
          this.step = 8;
          break;
        case 8: //check the result
          console.log(this.resultVote);
          if(!this.resultVote.includes(undefined)){
            const yes = this.resultVote.reduce((acc,cur) => {if(cur == 0){acc ++;}return acc;});
            const no = this.resultVote.reduce((acc,cur) => {if(cur == 1){acc ++;}return acc;});
            const txt = `\`Resultat : yes = ${yes}, no = ${no}\``;
            this.send(txt);
            if(yes > no) this.step = 10;
            else this.step = 9;
            this.resultVote = [];
            this.action();
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

          let content2 = new Discord.MessageEmbed()
          .setTitle("Issue de la quête")
          .setDescription(this.displayText("log","game") + this.channel.name)
          .addField("Consigne",this.displayText("private","questEmoji"));

          const arrayUser2 = Array.from(this.players.values());
          this.arrayVoteMsgId = this.vote(arrayUser2,content2);

          this.step = 11;
          break;
        case 11: // check everybody vote
          let check = true;
          this.quest.forEach((item, i) => {
            if(item != true && item != false){
              check = false;
            }
          });


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

          this.boardProgress += ":"+emoji+":";

          // Number of Quest check
          this.board[this.round.toString()][0] = emoji;
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
        //deleting role 
        if(channel.guild.roles.cache.has(this.leaderRole)){
          channel.guild.roles.cache.get(this.leaderRole).delete("Deleting role").then(deleted => console.log(`Deleted role ${deleted.name}`))
        }
       
        if(this.step == 15){
          channel.send(this.displayText("gameAction","evilWin"))
        }

        if(this.step == 16){
          channel.send(this.displayText("gameAction","goodWin"))
        }

        case 17: // Reveal role
          this.players.forEach((item, i) => {
            const name = channel.members.get(i).user.username;
            const txt = name + " : "+item.toString()
            channel.send(txt)
          });
        case 18: // Credit
          break;

        default:
        //this case is not implemented
      }
    }
    this.promiseChannel.then( channel => { on(channel); });
}

  static privateConstructor(bot,channel){
    return new Avalon(bot,channel)
  }

  constructor(bot,channel) {
    super(bot,nameGame,jsonFile,channel)
    this.step = 0;
    this.round = 1;
    this.questSucceed = 0;
    this.questFailed = 0;
    this.leaderId = 0;
    this.edit = true;
    this.order = [];
    this.roleMap = new Map(Object.entries(jsonData["role"]));
    this.role = [];
    this.countDenied = 0;    
    this.boardData = jsonData["board"]
    this.board = JSON.parse(JSON.stringify(this.boardData["0"]));
    this.namesQuest = "";
    this.assassination = true;
    this.arrayVoteMsgId = [];
    this.quest = new Discord.Collection(); // {id : boolean}
    this.resultVote = [];
    this.boardProgress = "";
  }

  //add player to the collection 
  addPlayer(user){
    this.players.set(user.id,new AvalonPlayer(this,user));
  }

 
  introduction(){
    const embed = this.mainEmbed;
    embed.setDescription("Création de la partie Avalon.");
    this.action();
  }

  displayBoard = function (game,board){
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
  
  // exports.displayBoard = displayBoard;
  
  
  printBoard = function (game) {
    const nb = game.players.size.toString();
    game.channel.send("```" +game.displayText("players",nb)+ "```")
    game.board = JSON.parse(JSON.stringify(game.boardData[nb]))
    displayBoard(game,game.board)
    const msgDenied = "```" + game.countDenied +
    game.displayText("gameAction","countDenied") + "```";
    game.channel.send(msgDenied);
    return;
  }
  
  // exports.printBoard = printBoard;

  embedNewRound(){
    const nb = this.players.size.toString();
    this.board =  JSON.parse(JSON.stringify(this.boardData[nb]))
    let boardmsg = "";
    let info = false;
    Object.values(this.board).forEach(val => {
      boardmsg = boardmsg + ":"+val[0]+":"
      if(val[1]) {boardmsg = boardmsg + ":pushpin:";info = true;}
    });
    if (info){
      boardmsg = boardmsg + "\n\":four::pushpin:\" "+this.displayText("rules","roundPin")
    }

    const orderName = this.order.map(id => this.channel.members.get(id).user.toString());
    // const pt1 = `Actual leader is: ${orderName[this.leaderId]}`;
    // const pt2 = orderName.slice(this.leaderId,orderName.length).reduce((acc,cur,ind) => `${acc} \n ${ind+1+this.leaderId}:${cur}`,pt1);
    // const afficheOrdre = orderName.slice(0,this.leaderId).reduce((acc,cur,ind) => `${acc} \n ${ind+1}:${cur}`,pt2);
    

    const embed = this.mainEmbed
    .setDescription("Partie en cours")
    .addField("Ordre",orderName.reduce((acc,cur,ind) => `${acc} \n ${ind+1}:${cur}`,`Actual leader is:\n${orderName[this.leaderId]}`),true)
    // .addField("Ordre v2",afficheOrdre,true)
    .addField("Board",boardmsg+"\nProgression :\n"+this.boardProgress+"...",true)
    .addField("Refus",`${this.displayText("gameAction","rejectedCount")} \`${this.countDenied}\``,true)

    return embed;
  }
}
