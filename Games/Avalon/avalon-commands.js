const { Discord, fs, arrayOfFile } = require(`./../../function.js`)

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
      description : 'go to the last step or to the step indicated  ',
      execute(bot,game,message, args) {
        if(args.length == 0){
          // return to the last step
          game.step = game.step - 1;
        }else{
          const regex = /[0-9]+/g;
          const found = args[0].match(regex);
          if(found >= 0 && found <= 18) game.step = parseInt(found[0])
        }
        console.log("step => ",game.step)
        game.channel.send("go to the step:"+game.step)
        // game.channel.send(game.displayText("step","3") => "la step 3 est l'enregistrement")
        game.action();
      }
    }
    ,{
      name : 'start',
      description : 'During step 2, when the number of players is enough you can start the game',
      execute(bot,game,message, args) {
        if(!commandAllow(game,message,"start",[2])) return;
        // const msg =
        game.channel.send("```"+`${game.displayText("log","start")} ${game.players.size} ${game.displayText("log","players")}`+"```");
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
            game.channel.send(`add ${user.username} : ${game.players.size} ${game.displayText("log","register")}`)
          }else{
            game.channel.send(`not added ${user.username} : already added or is a bot`)
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
            game.channel.send(`cannot remove ${user.username} : not register`)
          }
        });
        game.action()
      }
    }
    ,{
      name : 'role',
      description : "During step 4, choose roles ",
      execute(bot,game,message, args) {
        if(!commandAllow(game,message,"role",[4])) return;

        if(args.length == 0){
          console.log("number of arg < 1")
          return;
        }
        const nb = game.players.size
        if(args[0] != nb.toString()){
          console.log("wrong number of players"); return;
        }

        const name = args.toString().replace(","," ")
        if(game.roleMap.has(name)){
          const tab = game.roleMap.get(name).sort(function(){
            return 0.5-Math.random();
          })
          for(let i =0;i<nb;i++){
            game.players.set(game.order[i],tab[i])
          }

          //send role in DM
          for(i in game.order){
            const id = game.order[i]

            if(!game.channel.members.get(id).user.bot){
              const privateChan = game.channel.members.get(id);
              const role = game.players.get(id);
              const txt = "```"+game.displayText("log","game") + game.channel.name+"```";

              privateChan.send(txt)
              privateChan.send(game.displayText("private",`${role.length}role`))
              for(i in role){
                privateChan.send(game.displayText("private",`${role[i]}`))
              }
            }
          }
        }

        game.channel.send(game.displayText("gameAction","giveRole"))

        // console.log(game.players)

        game.step = 5;
        console.log("step => 5");

        game.action()
      }
    }
    ,{
      name : 'custom',
      description : "During step 4, choose yourself roles total custom ",
      execute(bot,game,message, args) {
        if(!commandAllow(game,message,"custom",[4])) return;
        //TO DO
        /*
        custom =>
        custom role => set a value in map roleMap and display again the choice
        custom board => create a propieties board to game.boardData
        */
        console.log("TO DO");
      }
    }
    ,{
      name : 'leader',
      description : "change the leader manually",
      execute(bot,game,message, args) {
        // if(!commandAllow(game,message,"custom",[4])) return;
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
      description : "During step 6, the leader choose the players for the quest ",
      execute(bot,game,message, args) {
        if(!commandAllow(game,message,"select",[6])) return;

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
        let names = ""
        let check = true;
        message.mentions.users.forEach( user => {
          // if(!user.bot && !game.players.has(user.id)){
          if(!game.players.has(user.id)){
            check = false;
          }else{
            game.quest.set(user.id,undefined);
            names += "@"+user.username+" "
          }
        });
        if(!check) return;

        // game.channel.send(game.displayText("gameAction","rejectedCount")+` ${game.countDenied}`)
        game.channel.send(game.displayText("gameAction","electTeam"))
        game.channel.send(names)

        game.step = 7;
        game.action()

      }
    }
    ,{
      name : 'yes',
      description : 'During step 8, yes to approuve the members of the quest',
      execute(bot,game,message, args) {
        if(!commandAllow(game,message,"yes",[8])) return;
        const id = message.member.id;
        const index = game.order.indexOf(id);
        if(index != -1){
          if(game.vote[index] == undefined) game.vote[index] = true;
          else{
            console.log("already vote");
          }
          game.action()
        }
      }
    }
    ,{
      name : 'no',
      description : 'During step 8, no to refuse the members of the quest !',
      execute(bot,game,message, args) {
        if(!commandAllow(game,message,"no",[8])) return;
        const id = message.member.id;
        const index = game.order.indexOf(id);
        if(index != -1){
          if(game.vote[index] == undefined) game.vote[index] = false;
          else{
            console.log("already vote");
          }
          game.action()
        }
      }
    }
    ,{
      name : 'vote',
      description : 'During step 8, to enter directly the result of the vote',
      execute(bot,game,message, args) {
        if(!commandAllow(game,message,"vote",[8])) return;

        if(args.length != 1){
          console.log("nb of arg != 1")
          return;
        }
        if(args[0] == "yeswin"){
          game.vote.fill(true)
          console.log(game.vote)
        }
        if(args[0] == "nowin"){
          game.vote.fill(false)
          console.log(game.vote)
        }
        if(args[0] == "result"){
          console.log(game.vote)
        }
        game.action()
      }
    }
    ,{
      name : 'quest',
      description : 'During step 10, the members of the vote have to succed or failed the quest',
      execute(bot,game,message, args) {
        if(!commandAllow(game,message,"quest",[11])) return;

        if(args.length != 1){
          console.log("nb of arg != 1")
          return;
        }

        const id = message.member.id

        if(!game.quest.has(id)){
          console.log("not allowed");
          return;
        }

        if(args[0] == "succes"){
          game.quest.set(id,true)
        }
        if(args[0] == "fail"){
          game.quest.set(id,false)
        }
        if(args[0] == "allfail"){
          game.quest.forEach((v, k) => {
              game.quest.set(k,false)
          });
        }
        if(args[0] == "allsucces"){
          game.quest.forEach((v, k) => {
              game.quest.set(k,true)
          });
        }

        game.action()
      }
    }
  ]
}

/*
!
*/
