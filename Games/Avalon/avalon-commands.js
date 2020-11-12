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
      name : 'vote',
      parent : 'avalon',
      default : "", 
      args : true,
      usage :  '<@mention> [<@mention>, ...]',
      type : "cheat",
      description: 'créer un vote test',
      execute(bot,game,message,args, settings) {
        const arrayUser = Array.from(message.mentions.members).map(x => x[1]);
        const content = "vote";
        const emojiArray = [`✅`,`❌`,`🏳️`,"🏴"];
        game.arrayMsg = game.vote(arrayUser,content,emojiArray);
        return arrayUser.map(x => x.id);
      }
    } 
    ,{
      name : 'tire',
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "test",
      description: 'tire un role au hasard',
      execute(bot,game,message,args, settings) {
        
        AvalonPlayer.displayRole(game);
        let role = ["Merlin","Morgane","Perceval","Assassin","GoodSoldier"];
        AvalonPlayer.giveRandomRole(game.players,role);
        AvalonPlayer.revealRole(game);
        let player1 = game.players.random();
        let player2 = game.players.random();
        console.log(player1.roleName,player2.roleName);
        console.log(AvalonPlayer.compare(player1,player1)); //true
        console.log(AvalonPlayer.compare(player1,player2)); //False
        console.log(AvalonPlayer.getRandomRole());
        
      }
    },

  ]
}

