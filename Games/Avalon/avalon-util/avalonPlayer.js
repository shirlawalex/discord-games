const Role = require(`../../Class/role.js`)
const Player = require(`../../Class/player.js`)
const {Discord } = require(`../../util/function.js`)


module.exports = class avalonPlayer extends Role(Player) {
  
  static listRole2 = ["Mordred","Merlin","Perceval"];

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
  
  constructor(user){
    super(user);
  }

}  