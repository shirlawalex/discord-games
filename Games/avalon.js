const Games = require('./games')

module.exports = class Avalon extends Games {

  static helloWorld (message) {
    message.reply('Channel Avalon created')
  }

  static matchEmoji (message) {
    return message.content.startsWith('!avalon')
  }
}
