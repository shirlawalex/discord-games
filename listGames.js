const Avalon = require('./Games/avalon.js')

module.exports = matchEmoji (message) {
  return message.content.startsWith('!avalon')
}
