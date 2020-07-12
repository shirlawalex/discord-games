const { Discord, fs, displayText, arrayOfFile } = require(`./../../function.js`)

var commandAllow = function(game,message,name,curStep) {
  //check if the commands is call while curStep
  if(!curStep.includes(game.step)){
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
      name : 'redo',
      description : 'Display rules !',
      execute(bot,game,message, args) {
        if(args.length == 0){
          // return to the last step
          game.step = game.step - 1;
        }else{
          const regex = /[0-9]+/g;
          const found = args[0].match(regex);
          if(found >= 0 && found <= 18) game.step = found
        }
        console.log("step => ",game.step)
        game.channel.send("go to the step:"+game.step)
        // game.channel.send(game.displayText("step","3") => "la step 3 est l'enregistrement")

      }
    }
    ,{
      name : 'start',
      description : 'During step 2, when the number of players is enough you can start the game',
      execute(bot,game,message, args) {
        if(!commandAllow(game,message,"start",[2])) return;
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
        if(!commandAllow(game,message,"add",[1,2])) {return;}

        message.mentions.users.forEach( user => {
          // if(!user.bot && !game.players.has(user.id)){
          if(!game.players.has(user.id)){
            game.players.set(user.id,[]);
            message.channel.send(`add ${user.username} : ${game.players.size} ${game.displayText("log","register")}`)
          }else{
            message.channel.send(`not added ${user.username} : already added or is a bot`)
          }
        });
        game.action();
      }
    }
    ,{
      name : 'remove',
      description : "During step 1, add people to the player's game list",
      execute(bot,game,message, args) {
        if(!commandAllow(game,message,"remove",[1,2])) return;

        message.mentions.users.forEach( user => {
          if(game.players.has(user.id)){
            game.players.delete(user.id,[]);
            game.channel.send(`remove ${user.username} : ${game.players.size} ${game.displayText("log","register")}`)
          }else{
            message.channel.send(`cannot remove ${user.username} : not register`)
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
