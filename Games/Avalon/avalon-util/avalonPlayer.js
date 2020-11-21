const Player = require(`../../Class/player.js`)
const { Discord} = require(`../../../util/function.js`)
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
  .set("Perceval","⚔️")
  .set("GoodSoldier","🦸‍♂️")
  .set("Mordred","👹")
  .set("Morgane","🧙‍♀️")
  .set("Assassin","🗡️")
  .set("Oberon","🤡")
  .set("EvilSoldier","🦹‍♂️")
  .set("Morgane/Assassin","🎎")
  ;

  static informationRole(game,players,info){

    players.forEach((player) => {
      const roleName = player.roleName;
      const name = player.displayName();
      switch (roleName) {
        case "Merlin":
          addMap(info,"Perceval",`\n${game.displayText("role","seePlayer")} "${name}"`)
          break;

        case "Mordred":
          addMap(info,"Morgane",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          addMap(info,"Assassin",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          addMap(info,"Morgane/Assassin",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          addMap(info,"EvilSoldier",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          break;

        case "Morgane":
          addMap(info,"Merlin",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainAgainstU")}`)
          addMap(info,"Perceval",`\n${game.displayText("role","seePlayer")} "${name}"`)
          addMap(info,"Mordred",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          addMap(info,"Assassin",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          addMap(info,"Morgane/Assassin",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          addMap(info,"EvilSoldier",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          break;

        case "Assassin":
          addMap(info,"Merlin",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainAgainstU")}`)
          addMap(info,"Morgane",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          addMap(info,"Morgane/Assassin",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          addMap(info,"Mordred",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          addMap(info,"EvilSoldier",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          break;

        case "Morgane/Assassin":
          addMap(info,"Merlin",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainAgainstU")}`)
          addMap(info,"Morgane",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          addMap(info,"Perceval",`\n${game.displayText("role","seePlayer")} "${name}"`)
          addMap(info,"Assassin",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          addMap(info,"Mordred",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          addMap(info,"EvilSoldier",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          break;

        case "Oberon":
          addMap(info,"Merlin",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainAgainstU")}`)
          addMap(info,"Morgane",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          addMap(info,"Mordred",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          addMap(info,"Assassin",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          addMap(info,"Morgane/Assassin",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          addMap(info,"EvilSoldier",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          break;

        case "EvilSoldier":
          addMap(info,"Merlin",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainAgainstU")}`)
          addMap(info,"Morgane",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          addMap(info,"Mordred",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          addMap(info,"Assassin",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          addMap(info,"Morgane/Assassin",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
          addMap(info,"EvilSoldier",`\n${game.displayText("role","thisPlayer")} "${name}" ${game.displayText("role","VilainWithU")}`)
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