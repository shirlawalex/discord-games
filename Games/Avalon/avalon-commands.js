const { Discord, fs, displayText, arrayOfFile } = require(`./../../function.js`)

var commandAllow = function(game,message,name,curStep) {
  //check if the commands is call while curStep
  console.log("check step:",game.step == curStep )
  if(game.step != curStep){
    const msg = `"${name}" : ${game.displayText("log","forbiden")}`;
    game.channel.send(msg);
    console.log(msg);
    return false;
  }
  return true;
}

module.exports  =  {
  commands : [
    {
      name : 'ping',
      description : 'Pong !',
      execute(bot,game,message, args) {
        message.channel.send("Pong!");
      }
    }
    ,{
      name : 'rules',
      description : 'Display rules !',
      execute(bot,game,message, args) {
        message.channel.send(game.displayText("menu","welcome"));
      }
    }
    ,{
      name : 'start',
      description : 'During step 2, when the number of players is enough you can start the game',
      execute(bot,game,message, args) {
        if(!commandAllow(game,message,"start",2)) return;
        // const msg =
        message.channel.send(`${game.displayText("log","start")} ${game.players.size} ${game.displayText("log","players")}`);
        game.step = 3;
        console.log("step => 3");
        game.action();
      }
    }
    ,{
      name : 'add',
      description : "During step 1, add people to the player's game list",
      execute(bot,game,message, args) {
        if(!commandAllow(game,message,"add",2) && !commandAllow(game,message,"add",1)) {return;}

        message.mentions.users.forEach( user => {
          // if(!user.bot && !game.players.has(user.id)){
          if(!game.players.has(user.id)){
            game.players.set(user.id,[]);
            message.channel.send(`add ${user.username} : ${game.players.size} ${game.displayText("log","register")}`)
          }else{
            console.log("not added")
          }
        });
        game.action();
      }
    }
    ,{
      name : 'remove',
      description : "During step 1, add people to the player's game list",
      execute(bot,game,message, args) {
        if(!commandAllow(game,message,"remove",1) && !commandAllow(game,message,"remove",2)) return;

        message.mention.forEach( user => {
          if(!user.bot && game.players.has(user.id)){
            game.players.delete(user.id,[]);
            game.channel.send(`remove ${user.username} : ${game.players.size} ${game.displayText("log","register")}`)
          }
        });
        game.action()
      }
    }
  ]
}

/*
!
*/
