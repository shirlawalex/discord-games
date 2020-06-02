module.exports  = class Games {

  //Common function

  static parse(message) {
    if (match(message)) {
      this.helloWorld(message.guild)
      return true
    }
    return false
  }

  static launch(guild){
    this.helloWorld(guild)
    this.newChannel(guild)
  }

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

      return true
    }

    //Customized function

    static match(message) {
      return false
    }

    static helloWorld (guild) {
      // guild.channels.cache.first.send('Hello World !')
      console.log("Hello World !")
    }

    static nameChannel () {
      let number = Math.floor((Math.random() * 65535) + 4096) //a random number with 4 hexa digit
      return 'UndefinedGame-' + number.toString(16);
    }
  }
