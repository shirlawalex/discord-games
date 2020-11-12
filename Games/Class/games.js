const { Discord, fs } = require(`../../util/function.js`)
const nameGame = "UndefinedGame"
const jsonFile = ''

module.exports  = class Games {

  //********  Customized function  ********//

  static privateConstructor(bot,channel){
    return new Games (bot,nameGame,jsonFile,channel)
  }

  introduction(){
    this.send("Bienvenu");
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
        const user = this.channel.members.get(player.id);
        this.send(user.displayName);
      });
    }
  }

  //senders of message
  sendDM(user,content){
    const privateChan = this.channel.members.get(user.id);
    if(privateChan && !privateChan.user.bot){
      return this.bot.send(privateChan,content);
    }else{return undefined;}
  }

  //send to all user in the channel a dm to a secret vote
  // arrayId of type Array
  // context and key of type String
  vote(arrayUser,content,emojiArray){
    let arrayIdMessage = new Array();
    for(let i = 0; i < arrayUser.length; i++){
      const user = arrayUser[i];
      const msgVote = this.sendDM(user,content);
      if(msgVote != undefined){
        if(emojiArray != undefined){    
          msgVote.then(m => {
            emojiArray.forEach(emoji => {
              m.react(emoji)
            });
            arrayIdMessage.push(m.id)
           });
        }else{
          msgVote.then(m => {
            m.react(`✅`);
            m.react(`❌`)
            arrayIdMessage.push(m.id)

          })
        }
        this.addCache(msgVote);
      }
    }
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
  loadVote(reaction,arrayIdMessage,emojiArray,result){
    const message = reaction.message;

    //Initialisation of the array result
    if(result.length != arrayIdMessage.length){
      result = Array.from({length: arrayIdMessage.length}, e => undefined)
      console.log("intializating array",result)
    }

    const index = arrayIdMessage.indexOf(message.id);
    if(index != -1){
      if(this._cacheMessage.has(message.id)){
        console.log(emojiArray);
        if(emojiArray.find(e => e == reaction.emoji.name)){
          result[index] = emojiArray.indexOf(reaction.emoji.name);
          //can't change your vote is deleted from the cache
          this._cacheMessage.delete(message.id)
        }
      }else{
        console.log("already vote")
      }
    }
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
