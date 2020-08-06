const { Discord, fs, arrayOfFile } = require(`./../../function.js`)

var addMap = function(map,key,text){
  map.forEach((value, tabKey) => {
    if(tabKey.find(e => e == key)){
      console.log(tabKey,key)
      map.set(tabKey, map.get(tabKey) + text)
    }
  });
}

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

var privateAllow = function(game,message,name) {
  //check if the command is call in private chan or in the main chan
  if( message.channel.type == "dm" ){
    const msg = `"${name}" : ${game.displayText("log","forbidenPrivate")}`;
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
        if(!privateAllow(game,message,"redo")) return;

        if(args.length == 0){
          // return to the last step
          game.step = game.step - 1;
        }else{
          const regex = /[0-9]+/g;
          const found = args[0].match(regex);
          if(found >= 0 && found <= 18) game.step = parseInt(found[0])
        }
        game.channel.send("go to the step:"+game.step)
        // game.channel.send(game.displayText("step","3") => "la step 3 est l'enregistrement")
        game.action();
      }
    }
    ,{
      name : 'start',
      description : 'During step 2, when the number of players is enough you can start the game',
      execute(bot,game,message, args) {
        if(!privateAllow(game,message,"start") || !commandAllow(game,message,"start",[2])) return;
        // const msg =
        game.channel.send("```"+`${game.displayText("log","start")} ${game.players.size} ${game.displayText("log","players")}`+"```");
        game.step = 3;
        game.action();
      }
    }
    ,{
      name : 'add',
      description : "During step 1, add people to the player's game list",
      execute(bot,game,message, args) {
        if(!privateAllow(game,message,"add") || !commandAllow(game,message,"add",[1,2])) {return;}

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
        if(!privateAllow(game,message,"remove") || !commandAllow(game,message,"remove",[1,2])) return;

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
        if(!privateAllow(game,message,"role") || !commandAllow(game,message,"role",[4])) return;

        //check argument
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
          //prepare information to send
          let info = new Map()
          //give random role
          const roles = game.roleMap.get(name).sort(function(){
            return 0.5-Math.random();
          })
          for(let i =0;i<nb;i++){
            game.players.set(game.order[i],roles[i])
            info.set(roles[i],"")
          }

          for(let i in game.order){
            const id = game.order[i];
            const rolePlayer = game.players.get(id);

            //information about the game
            let text = "```"+game.displayText("log","game") + game.channel.name+"```";

            //information about the role
            text += game.displayText("private",`${rolePlayer.length}role`)+" \n"
            for(let j in rolePlayer){
              text += game.displayText("private",`${rolePlayer[j]}`) +" \n"
              //information about power
              text += game.displayText("rules",`power`+`${rolePlayer[j]}`)

              if(j == 0){
              switch (rolePlayer[j]) {
                case "Merlin":
                  addMap(info,["Perceval"],`\nTu vois ce joueur <@${id}>`)
                  break;


                case "Mordred":
                  addMap(info,["Morgane"],`\nCe joueur <@${id}> est méchant avec toi`)
                  addMap(info,["Assassin"],`\nCe joueur <@${id}> est méchant avec toi`)
                  addMap(info,["EvilSoldier"],`\nCe joueur <@${id}> est méchant avec toi`)
                  break;

                case "Morgane":
                  addMap(info,["Merlin"],`\nCe joueur <@${id}> est méchant contre toi`)
                  addMap(info,["Perceval"],`\nTu vois ce joueur <@${id}>`)
                  addMap(info,["Mordred"],`\nCe joueur <@${id}> est méchant avec toi`)
                  addMap(info,["Assassin"],`\nCe joueur <@${id}> est méchant avec toi`)
                  addMap(info,["EvilSoldier"],`\nCe joueur <@${id}> est méchant avec toi`)
                  break;

                case "Assassin":
                  addMap(info,["Merlin"],`\nCe joueur <@${id}> est méchant contre toi`)
                  addMap(info,["Morgane"],`\nCe joueur <@${id}> est méchant avec toi`)
                  addMap(info,["Mordred"],`\nCe joueur <@${id}> est méchant avec toi`)
                  addMap(info,["EvilSoldier"],`\nCe joueur <@${id}> est méchant avec toi`)
                  break;

                case "Oberon":
                  addMap(info,["Merlin"],`\nCe joueur <@${id}> est méchant contre toi`)
                  addMap(info,["Morgane"],`\nCe joueur <@${id}> est méchant avec toi`)
                  addMap(info,["Mordred"],`\nCe joueur <@${id}> est méchant avec toi`)
                  addMap(info,["Assassin"],`\nCe joueur <@${id}> est méchant avec toi`)
                  addMap(info,["EvilSoldier"],`\nCe joueur <@${id}> est méchant avec toi`)
                  break;

                case "EvilSoldier":
                  addMap(info,["Merlin"],`\nCe joueur <@${id}> est méchant contre toi`)
                  addMap(info,["Morgane"],`\nCe joueur <@${id}> est méchant avec toi`)
                  addMap(info,["Mordred"],`\nCe joueur <@${id}> est méchant avec toi`)
                  addMap(info,["Assassin"],`\nCe joueur <@${id}> est méchant avec toi`)
                  addMap(info,["EvilSoldier"],`\nCe joueur <@${id}> est méchant avec toi`)
                  break;
                case "Perceval":
                case "GoodSoldier":
                default:
                  //no information to give
                }
              }
            }
            //stock information in a Map
            const aftertext = info.get(roles[i])
            info.set(roles[i],text + aftertext)
          }

          console.log(info)

          //send information in DM
          for(let i in game.order){
            const id = game.order[i]

            if(!game.channel.members.get(id).user.bot){
              const privateChan = game.channel.members.get(id);
              const role = game.players.get(id);
              privateChan.send(info.get(role))
            }
          }
        }

        game.channel.send(game.displayText("gameAction","giveRole"))
        // console.log(game.players)

        game.step = 5;
        game.action()
      }
    }
    ,{
      name : 'custom',
      description : "During step 4, choose yourself roles total custom ",
      execute(bot,game,message, args) {
        if(!privateAllow(game,message,"custom") || !commandAllow(game,message,"custom",[4])) return;
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
      name : 'display',
      description : "During step 4, choose yourself roles total custom ",
      execute(bot,game,message, args) {
        if( !commandAllow(game,message,"custom",[5,6,7,8,9,10,11,12,13,14,15,16,17,18])) return;
        game.players.forEach((item, i) => {
          const name = message.channel.members.get(i).user.username;
          const txt = name + " : "+item.toString()
          message.channel.send(txt)
        });
      }
    }
    ,{
      name : 'leader',
      description : "change the leader manually",
      execute(bot,game,message, args) {
        if(!privateAllow(game,message,"leader") || !commandAllow(game,message,"leader",[5,6])) return;

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
        if(!privateAllow(game,message,"name") || !commandAllow(game,message,"select",[6])) return;

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
        const id = message.author.id;
        const index = game.order.indexOf(id);
        if(index != -1){
          if(game.vote[index] == undefined) game.vote[index] = true;
          else{
            message.channel.send(game.displayText("gameAction","alreadyVote"))
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
        const id = message.author.id;
        const index = game.order.indexOf(id);
        if(index != -1){
          if(game.vote[index] == undefined) game.vote[index] = false;
          else{
            message.channel.send(game.displayText("gameAction","alreadyVote"))
          }
          game.action()
        }
      }
    }
    ,{
      name : 'vote',
      description : 'During step 8, to enter directly the result of the vote',
      execute(bot,game,message, args) {
        if(!privateAllow(game,message,"vote") || !commandAllow(game,message,"vote",[8])) return;

        if(args.length != 1){
          console.log("nb of arg != 1")
          return;
        }
        if(args[0] == "yeswin"){
          game.vote.fill(true)
          // console.log(game.vote)
        }
        if(args[0] == "nowin"){
          game.vote.fill(false)
          // console.log(game.vote)
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

        const id = message.author.id

        if(!game.quest.has(id)){
          console.log("not allowed");
          return;
        }

        switch (args[0]) {
          case "succes":
            game.quest.set(id,true);
            break;

          case "fail" :
            game.quest.set(id,false)
            break;

          case "allfail" :
            game.quest.forEach((v, k) => {
              game.quest.set(k,false)
            });
            break;

          case "allsucces" :
            game.quest.forEach((v, k) => {
              game.quest.set(k,true)
            });
            break;

          default:
            console.log("argument not allowed");
            return;
        }
        // console.log("quest : ",game.quest)

        game.action()
      }
    }
    ,{
      name : 'assassin',
      description : 'During step 10, the members of the vote have to succed or failed the quest',
      execute(bot,game,message, args) {
        if(!privateAllow(game,message,"name") || !commandAllow(game,message,"assassin",[14])) return;

        const id = message.author.id;
        // if(game.players.get(id).find(e => e == "Assassin") == undefined){ return; }
        if(args.length != 1){ return; }
        const nb = parseInt(args[0]);
        if(isNaN(nb)){ return ;}

        const target_id = game.order[nb-1];

        if(game.players.get(target_id).find(e => e == "Merlin") != undefined){
          game.step = 15 //find Merlin
          game.channel.send(game.displayText("gameAction",""))
        }else{
          game.step = 16 // not find Merlin
          game.channel.send(game.displayText("gameAction",""))

        }
        game.action()
      }
    }
  ]
}

/*
!
*/
