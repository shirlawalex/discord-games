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
          // if(user.bot || !game.players.has(user.id)){
          if(!game.players.has(user.id)){
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
      name : 'power',
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "information",
      description: 'Explain all powers !',
      execute(bot,game,message,args, settings) {
        const embed = new MessageEmbed()
        .setTitle(game.displayText("rules","titlepower"))
        .setDescription(game.displayText("rules","displaypower"))
        let text = "Power:\n";
        ["Merlin","Perceval","GoodSoldier","Mordred","Morgane","Assassin","Oberon","EvilSoldier"].forEach(x => {
          // text += "- "+game.displayText("rules","power"+x)+"\n";
          embed.addField(x,game.displayText("rules","power"+x))
        });
        // message.channel.send(text);
        message.channel.send(embed);
      }
    }
    ,{
      name : 'assassin',
      parent : 'avalon',
      default : "", 
      args : true,
      usage :  '<@mention>',
      type : "game",
      description: 'During step 10, the members of the vote have to succed or failed the quest',
      execute(bot,game,message,args, settings) {
        if(!commandAllow(game,settings,"assassin",[14])) return;

        const id = message.author.id;
        if(game.players.get(id).roleName != "Assassin" || game.players.get(id).roleName != "Morgane/Assassin" ){ game.send("not allowed"); return; }
        if(args.length != 1){ game.send("Seulement 1 mention") ; return; }

         
        const target_id = message.mentions.users.firstKey();;

        if(game.players.get(target_id) == "Merlin"){
          game.step = 15 //find Merlin
          game.send(game.displayText("gameAction","merlinFound"))
        }else{
          game.step = 16 // not find Merlin
          game.send(game.displayText("gameAction","merlinNotFound"))

        }
        game.action()
      }
    }
  ]
}

