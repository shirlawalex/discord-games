const {fs, Discord } = require(`../../util/function.js`)
const avalonPlayer = require("./avalon-util/avalonPlayer.js")
const Games = require("../Class/games.js")
const {displayRoles } = require(`./avalon-util/avalonFunction.js`)


const nameGame = "Avalon"
const jsonFile = './Games/Avalon/avalon-text.json'
const jsonData = JSON.parse(fs.readFileSync("./Games/Avalon/avalon-util/data.json"));
module.exports  = class Avalon extends Games {    
 
  handleReaction(reaction,user){
    this.result = [];
    this.result = this.loadVote(reaction,this.arrayMsg,[`✅`,`❌`,`🏳️`,"🏴"],this.result);

     console.log(this.result.length)
    let nb0 = this.result.filter(e => e == 0).length
    console.log("nbre de 0:",nb0);

    let nb1 = this.result.filter(e => e == 1).length
    console.log("nbre de 1:",nb1);
    /*
      if(nbTrue >= result.length / 2){ //to do}
        //the cache is use for specific message or for message out of the channel
        const message = reaction.message;
        console.log("to do : handle reaction")
        if(this._cacheMessage.has(message.id)){
          console.log("in the cache : action for this message")
          console.log(message.content)
        }else{
          console.log("message not in the cache")
        }
      }
      */
    }

    action(){
      let on = async (channel) => {
        console.log("step is:",this.step)
        switch (this.step) {
          case 0: //Initialisation
            /* 
            //* Create a role for leader of each round
            //* creation of the role
            //* bad idea
            channel.guild.roles.create({
              data: {
                name: `Leader of ${channel.name}`,
                color: 'YELLOW',
                discordGameRole : true,
                more : "true"
              },
              reason: 'because',
            })
            .then( role => {
              this.leaderRole = role.id;
            })
            .catch(console.error);
           */
            this.send(this.displayText("menu","welcome"))
            this.send(this.displayText("menu","players"))
            this.send(this.displayText("menu","goals"))
            this.step = 1;
            break;  
          case 2: // Starting party
            /*
            !start to launch the game with the players already register
            */
          case 1: // Logging players
            /*
            !add @mention [@mention ...] to add one or sevreal players to the partie
            check if number of players is between 5 and 10
            */
            if(this.players.size >= 5 && this.players.size <= 10){
              const nb = this.players.size.toString()
              this.step = 2;
            }else{
              this.step = 1;
            }
            break;
          case 3:  // Sorting randomly players
            const mainMsg = await this.setNewMainMsg();
            this.send("GAME START",this.edit);

            this.order = Player.randomize(this.players);
            let msg = this.displayText("gameAction","leaderOrder")+"\n";
            for(let i = 1;i<=this.order.length;i++){
              msg += `${i}: ${channel.members.get(this.order[i-1]).toString()}\n`;
            }
            this.send(msg,this.edit);
            this.step = 4;
            
          case 4: // give Role to players
            this.send(this.displayText("gameAction","selectRole"))
            displayRoles(this,this.players.size)
            this.leaderId = this.order.length - 1;
            break;
        }
      }

      this.promiseChannel.then( channel => { on(channel); });
    }
    

  static privateConstructor(bot,channel){
    return new Avalon(bot,channel)
  }

  constructor(bot,channel) {
    super(bot,nameGame,jsonFile,channel)
    this.edit = true;
    this.order = [];
    this.roleMap = new Map(Object.entries(jsonData["role"]));
  }

  //add player to the collection 
  addPlayer(user){
    this.players.set(user.id,new avalonPlayer(user));
  }

  introduction(){
    this.send("Introduction",this.edit);
    this.action();
  }
}
