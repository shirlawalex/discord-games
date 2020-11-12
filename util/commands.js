const Player = require(`../Games/Class/player.js`)
const {commandAllow } = require(`./function.js`)

const play = {
  name : 'play',
  parent : 'game',
  default : "", 
  args : false,
  usage :  '',
  type : "cheat",
  description: 'play the game',
  execute(bot,game,message,args, settings) {
    game.action();
  }
};

exports.play = play;



const players = {
  name : 'players',
  parent : 'game',
  default : "", 
  args : false,
  usage :  '',
  type : "information",
  description: 'diplay all players registered',
  execute(bot,game,message,args, settings) {
    game.displayUser(settings);
  }
};

exports.players = players;


const senddm = {
  name : 'senddm',
  parent : 'game',
  default : "", 
  args : true,
  usage :  '<@mention> <content>',
  type : "cheat",
  description: 'send a dm to a player',
  execute(bot,game,message,args, settings) {
    const user = message.channel.members.get(args.shift().substring(3,21));
    if(user){
      game.sendDM(user,args.join(" ")).then(console.log);
    }else{
      console.log("First argument not a valid mention");
    }
  }
};

exports.senddm = senddm;


const add = {
  name : 'add',
  parent : 'game',
  default : "", 
  args : true,
  usage :  '<@mention> [<@mention>, ...]',
  type : "game",
  description: "Before start add to registerd players",
  execute(bot,game,message,args, settings) {
    if(!commandAllow(game,settings,"add",[1,2])) return;
    
    message.mentions.users.forEach( user => {
      // if(!user.bot && !game.players.has(user.id)){
      if( !game.players.has(user.id)){

        game.addPlayers(user);
        game.channel.send(`add ${user.username} : ${game.players.size} ${bot.displayText(`text`,"game",`register`,settings.game.lang)}`)
      }else{
        game.channel.send(`not added ${user.username} : ${game.players.size} ${bot.displayText(`text`,"game",`cannotRegister`,settings.game.lang)}`)
      }
    });
    game.action();
  }
}

exports.add = add;

const remove = {
  name : 'remove',
  parent : 'avalon',
  default : "", 
  args : true,
  usage :  '<@mention> [<@mention>, ...]',
  type : "game",
  description: "During step 1, remove people to the player's game list",
  execute(bot,game,message,args, settings) {
    if(!commandAllow(game,settings,"remove",[1,2])) return;

    
    message.mentions.users.forEach( user => {
      if(game.players.has(user.id)){
        game.players.delete(user.id);
        game.channel.send(`remove ${user.username} : ${bot.displayText(`text`,"log",`remove`,settings.game.lang)}`)
      }else{
        game.channel.send(`can't remove ${user.username} : ${bot.displayText(`text`,"log",`notRegistered`,settings.game.lang)}`)
      }
    });
    game.action()
  }
}

exports.remove = remove;
