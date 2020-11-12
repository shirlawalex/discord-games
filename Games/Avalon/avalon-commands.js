const {MessageEmbed} = require("discord.js")
const {add,remove, play, senddm, players} = require("../../util/commands.js");
const {commandAllow} = require("../../util/function.js");
const Role = require("../Class/role.js");
const Avalon = require("./avalon-main.js")

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
        
        const embed = new MessageEmbed()
          .setColor("#DC143C")
          .setTitle("Recommended role settings")
          .setDescription("There is the recommended role for each number of players")
          .addField("5 joueurs","3 Bien : Merlin + 2 Serviteur du Bien. \n2 Mal : Mordred + Assassin.")
          .addField("6 joueurs","4 Bien : Merlin + Perceval + 2 Serviteur du Bien. \n2 Mal : Mordred + Morgane/Assassin.")
          .addField("7 joueurs","4 Bien : Merlin + Perceval + 2 Serviteur du Bien. \n3 Mal : Mordred + Morgane + Assassin.")
          .addField("8 joueurs","5 Bien : Merlin + Perceval + 3 Serviteur du Bien. \n3 Mal : Mordred + Morgane + Assassin.")
          .addField("9 joueurs","5 Bien : Merlin + Perceval + 3 Serviteur du Bien. \n4 Mal : Mordred + Morgane + Assassin + Serviteur du Mal.")
          .addField("10 joueurs","6 Bien : Merlin + Perceval + 4 Serviteur du Bien. \n4 Mal : Mordred + Morgane + Assassin + Oberon.");

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
        console.log("test");
        let msg = game.send("🦸‍♂️🦹‍♂️🧙‍♀️🧙‍♂️👹🤡⚔🗡🎎")
        msg.then( m => {
          m.react("🦸‍♂️")
          m.react("🦹‍♂️")
          m.react("🎎")
          m.react("🧙‍♀️")
          m.react("🧙‍♂️")
          m.react("👹")
          m.react("🤡")
          m.react("⚔")
          m.react("🗡");
        });
        // game.tire();
        // game.nbtire();
        // console.log("random in all",Avalon.randomRole())
        // console.log("Avalon role",Avalon.listRole);
        // console.log("compare",Avalon.compare(1,2));
        // console.log("roles restant",game.displayLeftRole())
        // console.log("random in left",game.randomLeftRole())
        // game.resetRole();

      }
    },

  ]
}

