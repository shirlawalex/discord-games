const Player = require(`../../Class/player.js`)
const {Role} = require(`../../Class/role.js`)

var addMap = function(map,key,text){
  map.set(key,map.get(key) + text);
}
module.exports = class AvalonPlayer extends Role(Player) {

  static getBoard = function(game){
    let info = false;
    let boardmsg = "";
      Object.values(game.board).forEach(val => {
        boardmsg = boardmsg + ":"+val[0]+":"
        if(val[1]) {boardmsg = boardmsg + ":pushpin:";info = true;}
      });
      if (info){
        boardmsg = boardmsg + "\n\":four::pushpin:\" "+game.displayText("rules","roundPin")
      }
    return boardmsg;
  }
    
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

  static informationRole(players,info){

    players.forEach((player) => {
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
          addMap(info,"Perceval",`\nTu vois ce joueur "${name}"`)
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
  }

  constructor(game,user){
    super(game,user);
  }
}  