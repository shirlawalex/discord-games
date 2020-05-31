module.exports  = class Games {

  //Common function

  static parse (message) {
    if (this.matchEmoji(message)) {
      this.helloWorld(message)
      //this.newChannel(message)
      return true
    }
    return false
  }

  static newChannel (message) {
    let number = Math.random() / 65535 //max 4 hexa digit
    let nameChannel = 'Games' + number.toString(4);
    let guild = message.guild;  //Get guild from the message
    guild.channels.create(nameChannel,{
      type: 'text',
      permissionOverwrites: [
        {
          id: message.guild.id,
          deny: ['VIEW_CHANNEL'],
        },
        {
          id: message.author.id,
          allow: ['VIEW_CHANNEL'],
        },
      ],
      reason: 'New channel for the game!' })
      .catch(err => {console.log("error : cannot create channel")})

      return true
    }

    //Customized function

    static matchEmoji (message) {
      return false
    }

    static helloWorld (message) {
      message.reply('Hello World !')
    }

    static nameChannel () {
      let number = Math.floor((Math.random() * 65535) + 4096) //a random number with 4 hexa digit
      return 'UndefinedGame-' + number.toString(16);
    }
  }
