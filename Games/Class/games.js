const { Discord, fs } = require(`../../util/function.js`)
const nameGame = "UndefinedGame"
const jsonFile = ''

module.exports  = class Games {

  //********  Customized function  ********//

  static privateConstructor(bot,channel){
    return new Games (bot,nameGame,jsonFile,channel)
  }

  introduction(){
    const embed = this.mainEmbed;
    embed.setDescription("Bienvenu");
    embed.addField("Test","texte de test");
    // this.send(embed,this.edit);
    this.action();
  }

  action(){
    console.log("Fill with the action")
  }

  handleReaction(reaction,user){
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

    //********  Common function  ********//


  //Constructor
  constructor(bot,name,jsonfile,promiseChannel){
    this.step = 0;
    this.edit = false; //message is sent one after the other
    this.bot = bot;
    this._lang = "Fr"
    promiseChannel.then((channel)=>{
      this._channel = channel;
    });
    this._promiseChannel = promiseChannel
    this._name = name //UndefinedGame
    this._jsonFile = jsonfile //'./Games/UndefinedJson.json'
    this._cacheMessage = new Discord.Collection();
    this._players = new Discord.Collection(); //Collection of the Object Player (id,user).
    this.mainEmbed = new Discord.MessageEmbed()
    .setColor("#DC143C")
    .setTitle(`${this.name}`)
    .setDescription("Partie Crée.");
  }

  //getters
  get name(){return this._name}

  get jsonText(){ return JSON.parse(fs.readFileSync(this._jsonFile)); }

  get id(){ return this.channel.id }

  get lang(){return this._lang}

  get channel(){ return this._channel }

  get promiseChannel(){ return this._promiseChannel }

  get cache(){ return this._cacheMessage }

  get players(){ return this._players }


  //Send message
  async send(content,main){
    //if main is true/defined the message will be edited in the main message
    if(main == undefined || main == false){
      return this.bot.send(this.channel,content);
    }else{
      const data = await this.bot.getGame(this.id);
      this.bot.sendLog(this.channel.guild,content);
      return this.editMsgCache(data.mainMsgId,content);
    }
  } 

  //Set Main Message
  async setNewMainMsg(){
    const main = await this.channel.send("`... main message loading, please wait.`").then(async message => {
      await this._cacheMessage.set(message.id,message);    
      await this.bot.updateGame(this.id,{ mainMsgId : message.id});
    })
    return main;
  }

  //add a message in the cache
  async addCache(promiseMessage){
    await promiseMessage.then( message => {
       this._cacheMessage.set(message.id,message)
    })
  }

  //edit content of a message in the cache
  async editMsgCache(msgId,text){
    let message = await this.cache.get(msgId);
    let m = message.edit(text).then(msg => {
      // console.log(`Updated the content of a message to ${msg.content}`);
      this._cacheMessage.set(msgId,msg);
    }).catch(console.error);
    return m;
  }

  // displayers of text
  displayText(context,key){
    return this.jsonText[context][key][this.lang]
  }

  //add player to the collection 
  addPlayer(user){
    this.players.set(user.id,new Player(user));
  }
  
  //display all user registered
  displayUser(settings){
    if(this.players.size == 0){
      this.send(`${this.bot.displayText(`text`,"log",`noneRegister`,settings.game.lang)}`);
    }else{
      this.players.forEach((player) => {
        // const user = this.channel.members.get(player.id);
        this.send(player.displayName());
      });
    }
  }

  //senders of message
  sendDM(user,content){
    const privateChan = this.channel.members.get(user.id);
    if(privateChan && !privateChan.user.bot){
      return this.bot.send(privateChan,content);
    }else{
      this.bot.sendLog(this.channel.guild,"BELOW SENT TO A BOT OR AN UNKNOW USER");
      return this.bot.sendLog(this.channel.guild,content);
    }
  }

  //send to all user in the channel a dm to a secret vote
  // arrayId of type Array
  // context and key of type String
  async vote(arrayUser,content,emojiArray){
    let arrayIdMessage = [];
    // for await (const user of arrayUser){
    for (let i = 0; i < arrayUser.length; i++){
      const user = arrayUser[i];
      const msgVote = this.sendDM(user,content);
      if(msgVote != undefined){
        if(emojiArray != undefined){    
          await msgVote.then(m => {
            arrayIdMessage.push(m.id);
            emojiArray.forEach(emoji => {
              m.react(emoji)
            });
          });
        }else{
          await msgVote.then(m => {
            arrayIdMessage.push(m.id);
            m.react(`✅`);
            m.react(`❌`)
          })
        }
        this.addCache(msgVote);
      }else{
        console.log("error in vote : send dm didnt work");
        return [];
      }
    }
    console.log("array",arrayIdMessage);
    return arrayIdMessage
  }


  //check/load/stock the result of the vote, need to be executed each time a reaction is detected
  // arrayIdMessage of type Array
  // result of type Array
  //reaction of type reaction
  /* exemple:0
  let result = loadVote(reaction,[id1,id2,...,idN],[])
  let nbTrue = result.reduce(
    (acc,cur) => {
      if(cur == true){
        acc ++;
      }
      return acc;
    }
  )
  if(nbTrue >= result.length / 2){ //to do}
  */
  /*
  this.result = [];
  this.result = this.loadVote(reaction,this.arrayMsg,[`✅`,`❌`,`🏳️`,"🏴"],this.result);
  
  console.log(this.result.length)
  let nb0 = this.result.filter(e => e == 0).length
  console.log("nbre de 0:",nb0);
  
  let nb1 = this.result.filter(e => e == 1).length
  console.log("nbre de 1:",nb1);
  */
  loadVote(reaction,arrayIdMessage,emojiArray,result){
    const message = reaction.message;
    //Initialisation of the array result
    if(result.length != arrayIdMessage.length){
      result = Array.from({length: arrayIdMessage.length}, e => undefined)
    }

    const index = arrayIdMessage.indexOf(message.id);
    console.log("index",index);
    if(index != -1){
      if(this._cacheMessage.has(message.id)){
        if(emojiArray.find(e => e == reaction.emoji.name)){
          result[index] = emojiArray.indexOf(reaction.emoji.name);
          this.send("1 vote enregistré");
          let tmp = result.reduce(
            (acc,cur) => {
              // console.log("cur",cur)
              if(cur != undefined){
                acc ++;
              }
              return acc;
            }
          )
          this.send(`${tmp} vote enregistrés`)
          
          //can't change your vote is deleted from the cache
          this._cacheMessage.delete(message.id)
        }
      }else{
        console.log("already vote")
      }
    }
    // result.then(e => {console.log(e); return e;});
    console.log(result);
    return result
  }


  //launcher
  static launch(bot,parent){
    return this.newChannel(bot,parent)
  }

  //Create the channel name
  static nameChannel () {
    let number = Math.floor((Math.random() * 65535) + 4096) //a random number with 4 hexa digit
    return this.name + '-' + number.toString(16);
  }

  //Create the Channel game
  static newChannel (bot,parent) {
    const guild = parent.guild
    const channel = guild.channels.create(this.nameChannel(),{
      type: 'text',
      topic : "Gaming channel",
      parent : parent,
      reason: 'New channel for the game!' })
      .catch(err => {console.error("error : cannot create channel"+err); return;})

      return this.privateConstructor(bot,channel)
  }


  }
