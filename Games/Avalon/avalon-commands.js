const {MessageEmbed} = require("discord.js")
const {add,remove, play, senddm, players} = require("../../util/commands.js");
const {commandAllow} = require("../../util/function.js");
const Role = require("../Class/role.js");
const Avalon = require("./avalon-main.js")
const AvalonPlayer = require("./avalon-util/avalonPlayer.js")

module.exports  =  {
  commands : [
    {
      name : 'pingavalon',
      parent : 'avalon',
      default : "", 
      args : true,
      usage :  '<word>',
      type : "information",
      description: 'Pong !',
      execute(bot,game,message,args, settings) {
        game.send("Pong!");
        game.send(args[0]);
      }
    }
    ,play
    ,senddm
    ,players
    ,add
    ,remove,
    ,{
      name : 'start',
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "game",
      description: 'During step 2, when the number of players is enough you can start the game',
      execute(bot,game,message,args, settings) {
        if( !commandAllow(game,settings,"start",[2])) return;
        
        game.send("```"+`${bot.displayText(`text`,"game","start",settings.game.lang)} ${game.players.size} ${bot.displayText(`text`,"game","players",settings.game.lang)}`+"```");
        game.step = 3;
        game.action();
      }
    }
    ,{
      name : 'recommended',
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "information",
      description: 'Show recommended role settings for the games',
      execute(bot,game,message,args, settings) {
        
        let embed = AvalonPlayer.embedRecommendation();

        game.send(embed);
      }
    }
    ,{
      name : 'leader',
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "cheat",
      description: "change the leader manually",
      execute(bot,game,message,args, settings) {
        if(!commandAllow(game,settings,"leader",[5,6])) return;

        if(args.length == 1){
          const val = parseInt(args[0]);
          const nb = game.order.length;
          if(!isNaN(val)){
            if(val >= 0 && val <= nb){
              game.leaderId = (val+nb-2)%nb
              game.step = 5;
              game.action();
            }
          }
        }else{
          console.log("error commande leader")
        }
      }
    }
    ,{
      name : 'select',
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "game",
      description: "During step 6, the leader choose the players for the quest ",
      execute(bot,game,message,args, settings) {
        if( !commandAllow(game,settings,"select",[6])) return;

        game.quest.clear();

        const id = game.order[game.leaderId];
        if(message.member.id != game.channel.members.get(id)){
          game.channel.send(game.displayText("log","notallowed"))
          return;
        }
        const nb = game.board[`${game.round}`][2];
        if(message.mentions.users.size != nb){
          const txt = "not the right number of players, need "+nb+" players";
          game.channel.send(txt)
          return;
        }
        game.namesQuest = ""
        let check = true;
        message.mentions.users.forEach( user => {
          if(!user.bot && !game.players.has(user.id)){
            check = false;
          }else{
            game.quest.set(user.id,undefined);
            game.namesQuest += user.toString()+" ";
          }
        });
        if(!check){
          game.channel.send(game.displayText("log","notallowed"))
          game.quest.clear()
          return;
        }

        game.channel.send(game.displayText("gameAction","electTeam"))
        game.channel.send(game.namesQuest)

        game.step = 7;
        game.action()

      }
    }
    ,{
      name : 'assassin',
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "game",
      description: 'During step 10, the members of the vote have to succed or failed the quest',
      execute(bot,game,message,args, settings) {
        if(!privateAllow(game,message,"assassin") || !commandAllow(game,settings,"assassin",[14])) return;

        const id = message.author.id;
        // if(game.players.get(id).find(e => e == "Assassin") == undefined){ return; }
        if(args.length != 1){ return; }
        const nb = parseInt(args[0]);
        if(isNaN(nb)){ return ;}

        const target_id = game.order[nb-1];

        if(game.players.get(target_id).find(e => e == "Merlin") != undefined){
          game.step = 15 //find Merlin
          game.channel.send(game.displayText("gameAction","merlinFound"))
        }else{
          game.step = 16 // not find Merlin
          game.channel.send(game.displayText("gameAction","merlinNotFound"))

        }
        game.action()
      }
    }
  ]
}

