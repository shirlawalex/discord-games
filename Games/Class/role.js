const {Discord } = require(`../../util/function.js`)


/* C'est une classe de fonctionnalité qu'on peut additione aux jeux pour ajouter des fonctionnalité */

let Role = Base => class Role extends Base {
  static emojiRole = new Discord.Collection()
  .set("gentil","😇")
  .set("mechant","😈")
  .set("neutre","🙂")
  //😇😈🙂

  constructor(game,user){
    super(game,user);
    this.roleName = "";
  }

  static revealRole(game){
    let msg = "Voici les rôles des joueurs:";
    game.players.forEach(player => {msg += `\n${player.displayName()} est ${player.roleName}`});
    game.send(msg,false);
  }

  static displayRole(game){
    const embed = new Discord.MessageEmbed()
  .setColor("#DC143C")
  .setTitle("Choix des rôles")
  .setDescription("Choissisez quels sont les personnages vous souhaitez incarner en cliquant sur l'emoji correspondant. \nPour voir la liste des rôles recommandés selon le nombre de joueurs, éxécutez la commande `!recommended`.\n Pour voir la liste des pouvoirs, éxécutez la commande `!power`. ");

    this.emojiRole.forEach((emoji,role) => {
      embed.addField(role,emoji,true)
    });

    embed.addField("Recommended roles","5 joueurs: \n- 3 Bien : Merlin + 2 Serviteur du Bien.\n- 2 Mal : Mordred + Assassin.",false);
    embed.addField("Refresh","Pour remettre à zéro la liste des rôles, cliquez sur : 🔄",false);
    let msg = game.send(embed)
    msg.then( m => {
      this.emojiRole.forEach((emoji)=>m.react(emoji))
    });
    msg.then(m => m.react("🔄"));
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
}

exports.Role = Role;
