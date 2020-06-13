var fs = require("fs");

module.exports  = class Games {

  //////// Customized function
  static nameGame = "UndefinedGame"
  static jsonFile = './Games/UndefinedJson.json'

  static privateConstructor(channel){
    return new Games (channel)
  }

  static match(message) {
    return false
  }

  static helloWorld (guild) {
    // guild.channels.cache.first.send('Hello World !')
    console.log("Hello World !")
  }

  action(guild){
    console.log("Fill with the action")
  }

  handleReaction(reaction,user){
    console.log("to do : handle reaction")
  }

  handleMessage(message,user){
    console.log("to do : handle message")
  }


  //////// Common function
  static jsonTextGame = JSON.parse(fs.readFileSync(this.jsonFile));

  //Constructor
  constructor(currentChannel) {
    this._lang = "Fr"
    this._channel = currentChannel
  }

  //getters
  get id(){
    return this.channel.id
  }
  get lang(){return this._lang}
  get channel(){
    return this._channel
  }

  // fetch the promises of the channel
  // fetch(){
  //   return this._channel.fetch()
  // }

  // displayers of text
  displayText(context,key){
    return jsonText[context][key][this.lang]
  }


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

  //parser of command
  static parse(message) {
    if (match(message)) {
      this.helloWorld(message.guild)
      return true
    }
    return false
  }

  //launcher
  static launch(parent){
    const guild = parent.guild
    // this.helloWorld(guild)
    return this.newChannel(parent)
  }

  //Create the channel name
  static nameChannel () {
    let number = Math.floor((Math.random() * 65535) + 4096) //a random number with 4 hexa digit
    return this.nameGame + '-' + number.toString(16);
  }

  //Create the Channel game
  static newChannel (parent) {
    const guild = parent.guild
    const channel = guild.channels.create(this.nameChannel(),{
      type: 'text',
      topic : "Gaming channel",
      parent : parent,
      permissionOverwrites: [
        {
          id: guild.id,
          deny: ['VIEW_CHANNEL'],
        },
        // {
        //   id: message.author.id,
        //   allow: ['VIEW_CHANNEL'],
        // },
      ],
      reason: 'New channel for the game!' })
      .catch(err => {console.log("error : cannot create channel")})

      //new Object => action
      return this.privateConstructor(channel)
    }


  }
