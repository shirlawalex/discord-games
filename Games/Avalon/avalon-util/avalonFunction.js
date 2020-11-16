const Role = require(`../../Class/role.js`)
const Player = require(`../../Class/player.js`)
const { Discord } = require(`../../../util/function.js`)


var displayRoles = function(game,nb){
  const embed = new Discord.MessageEmbed()
  .setColor("#DC143C")
  .setTitle("Choix des rôles")
  .setDescription("Choissisez quels sont les personnages vous souhaitez incarner.")
  // .setThumbnail(game.bot.user.displayAvatarURL())
  // .setFooter("Je suis sur le pied du footer",bot.user.displayAvatarURL());

  let tmp = 0;
  game.roleMap.forEach((value,key) => {
    if(key.startsWith(nb.toString())){
      tmp ++;
      let name = `Role "${key}":\n`;
      let content = "";
      for(i in value){
        content += `${value[i]}`
        if(i!=value.length){
          content += "\n"
        }
      }
      embed.addField(name,content,true);
    }
  });
        
  number = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣"];
  game.send(embed)
  .then(m => {
    for(let i = 0;i<tmp;i++){
      m.react(number[i]);
    }
    m.react("🆕");
  });
}

exports.displayRoles = displayRoles;

/* 
.addFields(
  { value :":x::x::x::x::x:",inline : true},
  {name : "un champ 2", value :" sa valaue",inline : true},
  {name : "un champ 3", value :" sa valaue",inline : false},
  {name : "un champ 4", value :" sa valaue",inline : true}
)
*/



var addMap = function(map,key,text){
  map.forEach((value, tabKey) => {
    if(tabKey.find(e => e == key)){
      map.set(tabKey, map.get(tabKey) + text)
    }
  });
}

exports.addMap = addMap;


var getBoard = function(game){
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

exports.getBoard = getBoard;