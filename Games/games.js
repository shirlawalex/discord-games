const { Discord, fs } = require(`../util/function.js`)
const nameGame = "UndefinedGame"
const jsonFile = './Games/games-text.json'

module.exports  = class Games {

  //////// Customized function

  static privateConstructor(channel){
    return new Games (nameGame,jsonFile,channel)
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

  //////// Common function

  //Constructor
  constructor(name,jsonfile,promiseChannel) {
    this._lang = "Fr"
    promiseChannel.then((channel)=>{this._channel = channel});
    this._promiseChannel = promiseChannel
    this._name = name //UndefinedGame
    this._jsonFile = jsonfile //'./Games/UndefinedJson.json'
    this._cacheMessage = new Discord.Collection()
  }

  //getters
  get name(){return this._name}

  get jsonText(){ return JSON.parse(fs.readFileSync(this._jsonFile)); }

  get id(){ return this.channel.id }

  get lang(){return this._lang}

  get channel(){ return this._channel }

  get promiseChannel(){ return this._promiseChannel }

  get cache(){ return this._cacheMessage }


  //add a message in the cache
  addCache(promiseMessage){
    promiseMessage.then( message => {
      this._cacheMessage.set(message.id,message)
    })
  }

  //edit content of a message in the cache
  editMsgCache(msgId,text){
    let message = this._cacheMessage.get(msgId);
    message.edit(text).then(msg => {
      console.log(`Updated the content of a message to ${msg.content}`);
      this._cacheMessage.set(msgId,msg);
    }).catch(console.error);
  }

  // displayers of text
  displayText(context,key){
    return this.jsonText[context][key][this.lang]
  }

  //display all user of the channel
  displayUser(channel){
    // channel.members.forEach((user, i) => {
    //   console.log(user.name)
    // });
  }

  //senders of message
  sendDM(user,context,key){
    //send
    console.log(jsonTextGame[context][key][lang])
  }

  //send to all user in the channel a dm to a secret vote
  // arrayId of type Array
  // context and key of type String
  vote(arrayIdUser,context,key){
    let arrayIdMessage = new Array();
    for(let i = 0; i < arrayIdUser.length; i++){
      const id = arrayIdUser[i];
      const privateChan = this.channel.members.get(id);
      if(!privateChan.user.bot){
        const msgVote = privateChan.send(this.displayText(context,key))
        msgVote.then(m => {
          m.react(`✅`);
          m.react(`❌`)
          arrayIdMessage.push(m.id)
        })
        super.addCache(msgVote);
      }
    }
    return arrayIdMessage
  }

  //send to all user in the channel a dm to a secret vote
  // arrayId of type Array
  // context and key of type String
  voteCustomEmoji(arrayIdUser,content,emojiArray){
    if(arrayIdUser.length == 0){
      //everyone
    }
    let arrayIdMessage = new Array();
    for(let i = 0; i < arrayIdUser.length; i++){
      const id = arrayIdUser[i];
      const privateChan = this.channel.members.get(id);
      if(!privateChan.user.bot){
        const msgVote = privateChan.send(content)
        msgVote.then(m => {
          emojiArray.forEach(emoji => {
            m.react(emoji)
          });
          arrayIdMessage.push(m.id)
        })
        super.addCache(msgVote);
      }
    }
    return arrayIdMessage
  }
  //check/load/stock the result of the vote, need to be executed each time a reaction is detected
  // arrayIdMessage of type Array
  // result of type Array
  //reaction of type reaction
  /* exemple:
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
  loadVote(reaction,arrayIdMessage,result){
    const message = reaction.message;

    //Initialisation of the array result
    if(result.length != arrayIdMessage.length){
      result = Array.from({length: arrayIdMessage.length}, e => undefined)
      console.log("intializating array",result)
    }

    const index = arrayIdMessage.indexOf(message.id);
    if(index != -1){
      if(this._cacheMessage.has(message.id)){
        if(reaction.emoji.name == `✅` || reaction.emoji.name == `❌`){
          result[index] = (reaction.emoji.name == `✅`);
          //can't change your vote is deleted from the cache
          this._cacheMessage.delete(message.id)
        }
      }else{
        console.log("already vote")
      }
    }

    return result
  }


  //parser of command
  static parse(message) {
    if (match(message)) {
      this.helloWorld(message.guild)
      return true
    }
    return false
  }

  //launcher
  static launch(bot,parent){
    const guild = parent.guild
    return this.newChannel(parent)
  }

  //Create the channel name
  static nameChannel () {
    let number = Math.floor((Math.random() * 65535) + 4096) //a random number with 4 hexa digit
    return this.name + '-' + number.toString(16);
  }

  //Create the Channel game
  static newChannel (parent) {
    const guild = parent.guild
    const channel = guild.channels.create(this.nameChannel(),{
      type: 'text',
      topic : "Gaming channel",
      parent : parent,
      // permissionOverwrites: [
      //   {
      //     id: guild.id,
      //     allow: ['VIEW_CHANNEL'],
      //   },
        // {
        //   id: message.author.id,
        //   allow: ['VIEW_CHANNEL'],
        // },
      // ],
      reason: 'New channel for the game!' })
      .catch(err => {console.log("error : cannot create channel")})

      //new Object => action
      return this.privateConstructor(channel)
    }


  }
