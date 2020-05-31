const Games = require('./games')

module.exports = class Avalon extends Games {

  static nameChannel () {
    let number = Math.floor((Math.random() * 65535) + 4096) //a random number with 4 hexa digit
    return 'Avalon-' + number.toString(16);
  }

  static helloWorld (message) {
    let msg = 'Channel '+this.nameChannel()+' reated'
    message.reply(msg)
  }

  static matchEmoji (message) {
    return message.content.startsWith('!avalon')
  }
}
