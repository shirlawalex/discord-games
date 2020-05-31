module.exports  = class Games {

  //Common function

  static parse (message) {
    if (this.matchEmoji(message)) {
      this.newChannel(message)
      return true
    }
    return false
  }

  static newChannel (message) {
    let number = Math.random() * 65535 //max 4 hexa digit
    let nmaeChannel = 'Games' + number.toString(16);
    let guild = message.guild;  //Get guild from the message
    guild.channels.create('Games',{
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

  }
