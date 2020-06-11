var fs = require("fs");

module.exports  = class Games {

  //////// Customized function
  static nameGame = "UndefinedGame"
  static jsonFile = './Games/UndefinedJson.json'

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


  //////// Common function
  static jsonTextGame = JSON.parse(fs.readFileSync(this.jsonFile));

  //Constructeur
  constructor(channel) {
    this.lang = "Fr"
    this.channel = channel
  }

  //getters
  get id(){return this.channel.id}

  //displayers of text
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
  static launch(guild){
    this.helloWorld(guild)
    this.newChannel(guild)
  }

  //Create the channel name
  static nameChannel () {
    let number = Math.floor((Math.random() * 65535) + 4096) //a random number with 4 hexa digit
    return this.nameGame + '-' + number.toString(16);
  }

  //Create the Channel game
  static newChannel (guild) {
    guild.channels.create(this.nameChannel(),{
      type: 'text',
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
      return true
    }


  }
