const {Discord } = require(`../../util/function.js`)


/* C'est une classe de fonctionnalité qu'on peut additione aux jeux pour ajouter des fonctionnalité */

let Role = Base => class Role extends Base {

  static emojiRole = new Discord.Collection()
  .set("Gentil","😇")
  .set("Mechant","😈")
  .set("Neutre","🙂")
  //😇😈🙂

  

  constructor(game,user,min,max){
    super(game,user);
    this.roleName = "";
  }


  static setNumber(game,minV,maxV){
    game.minPlayer = minV;
    game.maxPlayer = maxV;
  }

  static setMsgConfig(game,message){
    game.configMsg = message;
    game.roleIsSet = false;
  }

  static revealRole(game){
    let msg = "Voici les rôles des joueurs:";
    game.players.forEach(player => {msg += `\n${player.displayName()} est ${player.roleName}`});
    game.send(msg,false);
  }

  static displayRole(game){
    //* LE TEXTE VIENT DU TEXT.JSON DU BOT ET NON DU JEUX */
    // const embedRecommendation = this.embedRecommendation(game);
    // game.send(embedRecommendation);
    const embed = new Discord.MessageEmbed()
  .setColor("#DC143C")
  .setTitle(game.bot.displayText("role","main","selectRole",game.lang))
  .setDescription(game.bot.displayText("role","main","selectRoleExplain",game.lang));

    this.emojiRole.forEach((emoji,role) => {
      embed.addField(role,emoji,true)
    });

    embed.addField(game.bot.displayText("role","main","recommendedRoleTitle",game.lang),game.displayText("role",game.order.length+"Players"),false);
    embed.addField(game.bot.displayText("role","main","reset",game.lang),false);
    let msg = game.send(embed);
    msg.then( m => {
      this.setMsgConfig(game,m)
      this.emojiRole.forEach((emoji)=>m.react(emoji))
    });
    msg.then(m => m.react("🔄"));
  }

  static setConfigRole(game,reaction){
    if(reaction.message.id == game.configMsg.id && !game.roleIsSet){

      if(reaction.emoji.name == "🔄"){
        game.send(game.bot.displayText("role","main","isReset",game.lang));
        game.role = [];
      }
      const role = this.emojiRole.findKey(emoji => emoji == reaction.emoji.name);
      if(role){
        game.role.push(this.emojiRole.findKey(emoji => emoji == reaction.emoji.name));
        
        game.send(`${game.bot.displayText("role","main","roleSelected",game.lang)} ${role} ${reaction.emoji.name}. ${game.role.length} ${game.bot.displayText("role","main","nbRoleSelected",game.lang)}`);

        if(game.role.length == game.players.size){ //give Role to players
          game.roleIsSet = true;
          this.sendRoles(game);
          game.action();
        }
      }
    }
  }

  static sendRoles(game){
    const players = game.players;
    const nb = game.players.size
    const role = game.role;
    this.giveRandomRole(players,role);
    this.revealRole(game);

    //send information in DM
    players.forEach((player,id) => {
      const roleName = player.roleName;
      const name = player.displayName();

      let embed = new Discord.MessageEmbed()
        .setColor("#DC143C")
        .setTitle(`${game.bot.displayText("role","main","giveInfo",game.lang)} ${player.displayName()}`)
        .setDescription(game.displayText("log","game") + game.channel.name);

      embed.addField("Role",`${roleName}`,false);

      game.sendDM(player.info,embed);
    }); 
  }

  static sendRoles(game){
    const players = game.players;
    const nb = game.players.size
    const role = game.role;
    this.giveRandomRole(players,role);
    // this.revealRole(game);

    let info = new Map();
    for(let i =0;i<nb;i++){
      info.set(role[i],"");
    }

    this.informationRole(players,info);

    //send information in DM
    players.forEach((player) => {
      const roleName = player.roleName;

      let embed = new Discord.MessageEmbed()
        .setColor("#DC143C")
        .setTitle(`${game.bot.displayText("role","main","giveInfo",game.lang)} ${player.displayName()}`)
        .setDescription(`${game.bot.displayText("text","log","game",game.lang)} ${game.channel.name}`);

        //* NEED TO COMPLETE JSON'S GAME OF PERSONNAL DATA */
      embed.addField(game.bot.displayText("role","main","role",game.lang),game.displayText("role",`${roleName}`),false);
      embed.addField(game.bot.displayText("role","main","power",game.lang),game.displayText("role",`power${roleName}`),false);

      if(info.get(player.roleName) != ""){
        embed.addField(game.bot.displayText("role","main",`information`,game.lang),info.get(player.roleName));
      }

      game.sendDM(player.info,embed);
    }); 
  }

  static informationRole(players,info){

    players.forEach((player) => {
      const roleName = player.roleName;
      const name = player.displayName();
      switch (roleName) {
        case "Gentil":
          addMap(info,"Gentil",`\nTu es gentil "${name}"`)
          addMap(info,"Mechant",`\nIl est méchant "${name}"`)
          addMap(info,"Neutre",`\nIl est neutre "${name}"`)
          break;
        case "Mechant":
          addMap(info,"Gentil",`\nIl est gentil "${name}"`)
          addMap(info,"Mechant",`\nTu es méchant "${name}"`)
          addMap(info,"Neutre",`\nIl est neutre "${name}"`)
          break;
        case "Neutre":
          addMap(info,"Gentil",`\nIl est gentil "${name}"`)
          addMap(info,"Mechant",`\nIl est méchant "${name}"`)
          addMap(info,"Neutre",`\nTu es neutre "${name}"`)
          break;

        default:
        //no information to give
      }
    });
  }

  static compare(joueur1,joueur2){
    if(joueur1.roleName == "" || joueur2.roleName == "" ) return false;
    return joueur1.roleName == joueur2.roleName;
  }

  static getRandomRole(){
    return this.emojiRole.randomKey();
  }

  /* players = Discord.Collection & role = Array */
  static giveRandomRole(players,role){
    const roleWork = [...role]; 
    if(roleWork.length != players.size){
      console.log("wrong number of roles");
    }

    roleWork.sort(function(){
      return 0.5-Math.random();
    })
    
    return players.forEach(players => {
      players.roleName = roleWork.pop();
    });
  }

  static embedRecommendation(game){
    const embed = new Discord.MessageEmbed()
    .setColor("#DC143C")
    .setTitle(game.bot.displayText("role","main","recommendedRoleTitle",game.lang))
    .setDescription(game.bot.displayText("role","main","recommendedRole",game.lang))
    for(let i = game.minPlayer; i <= game.maxPlayer ; i++){
      embed.addField(game.displayText("role",i+"PlayersName"),game.displayText("role",i+"Players"))
    }

    return embed;
  }

  //************ COMMANDS *****************/

  static recommendedCommand = {
    name : 'recommended',
    parent : 'avalon',
    default : "", 
    args : false,
    usage :  '',
    type : "information",
    description: 'Show recommended role settings for the games',
    // execute(bot,game,message,args, settings) {
    execute : (bot,game,message,args, settings) => {
      /* bizare pas accès aux fonctions static  */
      const embed = this.embedRecommendation(game);
  
      game.send(embed);
    }
  }

  static powerCommand = {
    name : 'power',
    parent : 'avalon',
    default : "", 
    args : false,
    usage :  '',
    type : "information",
    description: 'Explain all powers !',
    execute(bot,game,message,args, settings) {
      const embed = new Discord.MessageEmbed()
      .setTitle(game.displayText("role","titlepower"))
      .setDescription(game.displayText("role","displaypower"))
      let text = "Power:\n";
      ["Merlin","Perceval","GoodSoldier","Mordred","Morgane","Assassin","Oberon","EvilSoldier"].forEach(x => {
        // text += "- "+game.displayText("rules","power"+x)+"\n";
        embed.addField(x,game.displayText("role","power"+x))
      });
      // message.channel.send(text);
      message.channel.send(embed);
    }
  }
}

exports.Role = Role;

