const {MessageEmbed} = require("discord.js")

var addMap = function(map,key,text){
  map.forEach((value, tabKey) => {
    if(tabKey.find(e => e == key)){
      map.set(tabKey, map.get(tabKey) + text)
    }
  });
}

var commandAllow = function(game,message,name,curStep) {
  //check if the commands is call while curStep
  if(!curStep.includes(game.step)){
    const msg = `"${name}" : ${game.displayText("log","forbiden")}`;
    game.channel.send(msg);
    return false;
  }
  return true;
}

var privateAllow = function(game,message,name) {
  //check if the command is call in private chan or in the main chan
  if( message.channel.type == "dm" ){
    const msg = `"${name}" : ${game.displayText("log","forbidenPrivate")}`;
    game.channel.send(msg);
    return false;
  }
  return true;
}


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
        message.channel.send("Pong!");
        message.channel.send(args[0]);
      }
    }
    ,{
      name : 'help',
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "cheat",
      description: 'Liste des commandes',
      execute(bot,game,message,args, settings) {
        message.channel.send("voici les commandes")

      }
    }
    ,{
      name : 'rules',
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "information",
      description: 'Display rules !',
      execute(bot,game,message,args, settings) {
        const embed = new MessageEmbed()
        .setTitle("Rules of Avalon")
        .setDescription(game.displayText("menu","goals"))
        game.channel.send(embed);
      }
    }
    ,{
      name : 'board',
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "information",
      description: 'Display the board for each number of player !',
      execute(bot,game,message,args, settings) {
        const embed = new MessageEmbed()
        .setTitle("Board of Avalon")
        .setDescription(game.displayText("setting","board")+"\n\":four::pushpin:\" "+game.displayText("rules","roundPin"));

        ["5","6","7","8","9","10"].forEach((item, i) => {
          const board = game.boardData[item]
          let msg = "";
          Object.values(board).forEach(val => {
            msg = msg + ":"+val[0]+":"
            if(val[1]) {msg = msg + ":pushpin:";}
          });
          embed.addField(item+game.displayText("log","players"),msg);
        });
        game.channel.send(embed);
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
      name : 'redo',
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "game",
      description: 'go to the last step or to the step indicated  ',
      execute(bot,game,message,args, settings) {
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
        game.action();
      }
    }
    ,{
      name : 'start',
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "game",
      description: 'During step 2, when the number of players is enough you can start the game',
      execute(bot,game,message,args, settings) {
        if(!privateAllow(game,message,"start") || !commandAllow(game,message,"start",[2])) return;
        game.channel.send("```"+`${game.displayText("log","start")} ${game.players.size} ${game.displayText("log","players")}`+"```");
        game.step = 3;
        game.action();
      }
    }
    ,{
      name : 'add',
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "game",
      description: "During step 1, add people to the player's game list",
      execute(bot,game,message,args, settings) {
        if(!privateAllow(game,message,"add") || !commandAllow(game,message,"add",[1,2])) {return;}

        message.mentions.users.forEach( user => {
          if( !game.players.has(user.id)){

          // if(!user.bot && !game.players.has(user.id)){
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
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "game",
      description: "During step 1, remove people to the player's game list",
      execute(bot,game,message,args, settings) {
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
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "game",
      description: "During step 4, choose roles ",
      execute(bot,game,message,args, settings) {
        if(!privateAllow(game,message,"role") || !commandAllow(game,message,"role",[4])) return;

        const nb = game.players.size

        //check argument
        if(args.length == 0) return;
        if(args[0] != nb.toString()) return;

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
              text += "Power: "+game.displayText("rules",`power`+`${rolePlayer[j]}`)

              const name = game.channel.members.get(id).user.username;
              if(j == 0){
                switch (rolePlayer[j]) {
                  case "Merlin":
                    addMap(info,["Perceval"],`\nTu vois ce joueur "${name}"`)
                    break;


                  case "Mordred":
                    addMap(info,["Morgane"],`\nCe joueur "${name}" est méchant avec toi`)
                    addMap(info,["Assassin"],`\nCe joueur "${name}" est méchant avec toi`)
                    addMap(info,["EvilSoldier"],`\nCe joueur "${name}" est méchant avec toi`)
                    break;

                  case "Morgane":
                    addMap(info,["Merlin"],`\nCe joueur "${name}" est méchant contre toi`)
                    addMap(info,["Perceval"],`\nTu vois ce joueur "${name}"`)
                    addMap(info,["Mordred"],`\nCe joueur "${name}" est méchant avec toi`)
                    addMap(info,["Assassin"],`\nCe joueur "${name}" est méchant avec toi`)
                    addMap(info,["EvilSoldier"],`\nCe joueur "${name}" est méchant avec toi`)
                    break;

                  case "Assassin":
                    addMap(info,["Merlin"],`\nCe joueur "${name}" est méchant contre toi`)
                    addMap(info,["Morgane"],`\nCe joueur "${name}" est méchant avec toi`)
                    addMap(info,["Mordred"],`\nCe joueur "${name}" est méchant avec toi`)
                    addMap(info,["EvilSoldier"],`\nCe joueur "${name}" est méchant avec toi`)
                    break;

                  case "Oberon":
                    addMap(info,["Merlin"],`\nCe joueur "${name}" est méchant contre toi`)
                    addMap(info,["Morgane"],`\nCe joueur "${name}" est méchant avec toi`)
                    addMap(info,["Mordred"],`\nCe joueur "${name}" est méchant avec toi`)
                    addMap(info,["Assassin"],`\nCe joueur "${name}" est méchant avec toi`)
                    addMap(info,["EvilSoldier"],`\nCe joueur "${name}" est méchant avec toi`)
                    break;

                  case "EvilSoldier":
                    addMap(info,["Merlin"],`\nCe joueur "${name}" est méchant contre toi`)
                    addMap(info,["Morgane"],`\nCe joueur "${name}" est méchant avec toi`)
                    addMap(info,["Mordred"],`\nCe joueur "${name}" est méchant avec toi`)
                    addMap(info,["Assassin"],`\nCe joueur "${name}" est méchant avec toi`)
                    addMap(info,["EvilSoldier"],`\nCe joueur "${name}" est méchant avec toi`)
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
        game.step = 5;
        game.action()
      }
    }
    ,{
      name : 'custom',
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "game",
      description: "During step 4, choose yourself roles total custom ",
      execute(bot,game,message,args, settings) {
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
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "information",
      description: "Display the players ",
      execute(bot,game,message,args, settings) {
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
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "cheat",
      description: "change the leader manually",
      execute(bot,game,message,args, settings) {
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
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "game",
      description: "During step 6, the leader choose the players for the quest ",
      execute(bot,game,message,args, settings) {
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
          if(!user.bot && !game.players.has(user.id)){
            check = false;
          }else{
            game.quest.set(user.id,undefined);
            names += "@"+user.username+" "
          }
        });
        if(!check){
          game.channel.send(game.displayText("log","notallowed"))
          game.quest.clear()
          return;
        }

        game.channel.send(game.displayText("gameAction","electTeam"))
        game.channel.send(names)

        game.step = 7;
        game.action()

      }
    }
    ,{
      name : 'vote',
      parent : 'avalon',
      default : "", 
      args : false,
      usage :  '',
      type : "cheat",
      description: 'During step 8, to enter directly the result of the vote',
      execute(bot,game,message,args, settings) {
        if(!privateAllow(game,message,"vote") || !commandAllow(game,message,"vote",[8])) return;

        if(args.length != 1){
          console.log("nb of arg != 1")
          return;
        }
        if(args[0] == "yeswin"){
          game.vote.fill(true)
        }
        if(args[0] == "nowin"){
          game.vote.fill(false)
        }
        if(args[0] == "result"){
          console.log(game.vote)
        }
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

