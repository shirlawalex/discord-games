const {Discord } = require(`../../../util/function.js`)
const Player = require(`../../Class/player.js`)
const {Role} = require(`../../Class/role.js`)

var addMap = function(map,key,text){
  map.set(key,map.get(key) + text);
  // map.forEach((value, tabKey) => {
  //   if(tabKey){
  //     if(tabKey.find(e => e == key)){
  //       map.set(tabKey, map.get(tabKey) + text)
  //     }
  //   }
  // });
}
module.exports = class AvalonPlayer extends Role(Player) {
  
  static emojiRole = new Discord.Collection()
  .set("Merlin","🧙‍♂️")
  .set("Perceval","⚔")
  .set("GoodSoldier","🦸‍♂️")
  .set("Mordred","👹")
  .set("Morgane","🧙‍♀️")
  .set("Assassin","🗡")
  .set("Oberon","🤡")
  .set("EvilSoldier","🦹‍♂️")
  .set("Morgane/Assassin","🎎")
  ;
  
  static setConfigRole(game,reaction){
    if(reaction.emoji.name == "🔄"){
      game.send("Restart! 🔄 Liste des roles remise à zéro.");
      game.role = [];
    }
    const role = this.emojiRole.findKey(emoji => emoji == reaction.emoji.name);
    if(role){
      game.role.push(this.emojiRole.findKey(emoji => emoji == reaction.emoji.name));
      
      game.send(`Role selectionné : ${role} ${reaction.emoji.name}. ${game.role.length} rôle.s enregistré.s.`);

      if(game.role.length == game.players.size){ //give Role to players
        this.sendRoles(game)
        game.step = 5;
        game.action();
      }
    }
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

    players.forEach((player,id) => {
      const roleName = player.roleName;
      const name = player.displayName();
      switch (roleName) {
        case "Merlin":
          addMap(info,"Perceval",`\nTu vois ce joueur "${name}"`)
          break;

        case "Mordred":
          addMap(info,"Morgane",`\nCe joueur "${name}" est méchant avec toi`)
          addMap(info,"Assassin",`\nCe joueur "${name}" est méchant avec toi`)
          addMap(info,"Morgane/Assassin",`\nCe joueur "${name}" est méchant avec toi`)
          addMap(info,"EvilSoldier",`\nCe joueur "${name}" est méchant avec toi`)
          break;

        case "Morgane":
          addMap(info,"Merlin",`\nCe joueur "${name}" est méchant contre toi`)
          addMap(info,"Perceval",`\nTu vois ce joueur "${name}"`)
          addMap(info,"Mordred",`\nCe joueur "${name}" est méchant avec toi`)
          addMap(info,"Assassin",`\nCe joueur "${name}" est méchant avec toi`)
          addMap(info,"Morgane/Assassin",`\nCe joueur "${name}" est méchant avec toi`)
          addMap(info,"EvilSoldier",`\nCe joueur "${name}" est méchant avec toi`)
          break;

        case "Assassin":
          addMap(info,"Merlin",`\nCe joueur "${name}" est méchant contre toi`)
          addMap(info,"Morgane",`\nCe joueur "${name}" est méchant avec toi`)
          addMap(info,"Morgane/Assassin",`\nCe joueur "${name}" est méchant avec toi`)
          addMap(info,"Mordred",`\nCe joueur "${name}" est méchant avec toi`)
          addMap(info,"EvilSoldier",`\nCe joueur "${name}" est méchant avec toi`)
          break;

        case "Morgane/Assassin":
          addMap(info,"Merlin",`\nCe joueur "${name}" est méchant contre toi`)
          addMap(info,"Morgane",`\nCe joueur "${name}" est méchant avec toi`)
          addMap(info,"Assassin",`\nCe joueur "${name}" est méchant avec toi`)
          addMap(info,"Mordred",`\nCe joueur "${name}" est méchant avec toi`)
          addMap(info,"EvilSoldier",`\nCe joueur "${name}" est méchant avec toi`)
          break;

        case "Oberon":
          addMap(info,"Merlin",`\nCe joueur "${name}" est méchant contre toi`)
          addMap(info,"Morgane",`\nCe joueur "${name}" est méchant avec toi`)
          addMap(info,"Mordred",`\nCe joueur "${name}" est méchant avec toi`)
          addMap(info,"Assassin",`\nCe joueur "${name}" est méchant avec toi`)
          addMap(info,"Morgane/Assassin",`\nCe joueur "${name}" est méchant avec toi`)
          addMap(info,"EvilSoldier",`\nCe joueur "${name}" est méchant avec toi`)
          break;

        case "EvilSoldier":
          addMap(info,"Merlin",`\nCe joueur "${name}" est méchant contre toi`)
          addMap(info,"Morgane",`\nCe joueur "${name}" est méchant avec toi`)
          addMap(info,"Mordred",`\nCe joueur "${name}" est méchant avec toi`)
          addMap(info,"Assassin",`\nCe joueur "${name}" est méchant avec toi`)
          addMap(info,"Morgane/Assassin",`\nCe joueur "${name}" est méchant avec toi`)
          addMap(info,"EvilSoldier",`\nCe joueur "${name}" est méchant avec toi`)
          break;
        case "Perceval":
        case "GoodSoldier":
        default:
        //no information to give
      }
    });

    //send information in DM
    players.forEach((player,id) => {
      const roleName = player.roleName;
      const name = player.displayName();

      let embed = new Discord.MessageEmbed()
        .setColor("#DC143C")
        .setTitle("Information pour "+player.displayName())
        .setDescription(game.displayText("log","game") + game.channel.name);

      embed.addField("Role",game.displayText("private",`${roleName}`),false);
      embed.addField("Pouvoir",game.displayText("rules",`power${roleName}`),false);
      if(info.get(player.roleName) != ""){
        embed.addField("Information",info.get(player.roleName));
      }

      game.sendDM(player.info,embed);
    }); 
  }

  static embedRecommendation(){
    const embed = new Discord.MessageEmbed()
    .setColor("#DC143C")
    .setTitle("Recommended role settings")
    .setDescription("There is the recommended role for each number of players")
    .addField("5 joueurs","3 Bien : Merlin + 2 Serviteur du Bien. \n2 Mal : Mordred + Assassin.")
    .addField("6 joueurs","4 Bien : Merlin + Perceval + 2 Serviteur du Bien. \n2 Mal : Mordred + Morgane/Assassin.")
    .addField("7 joueurs","4 Bien : Merlin + Perceval + 2 Serviteur du Bien. \n3 Mal : Mordred + Morgane + Assassin.")
    .addField("8 joueurs","5 Bien : Merlin + Perceval + 3 Serviteur du Bien. \n3 Mal : Mordred + Morgane + Assassin.")
    .addField("9 joueurs","5 Bien : Merlin + Perceval + 3 Serviteur du Bien. \n4 Mal : Mordred + Morgane + Assassin + Serviteur du Mal.")
    .addField("10 joueurs","6 Bien : Merlin + Perceval + 4 Serviteur du Bien. \n4 Mal : Mordred + Morgane + Assassin + Oberon.");

    return embed;
  }

  constructor(game,user){
    super(game,user);
  }


}  