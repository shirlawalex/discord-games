const { Discord, fs, displayText, arrayOfFile } = require(`./../../function.js`)


module.exports  =  {
  commands : [
    {
      name : 'pingavalon',
      description : 'Pong !',
      execute(bot,message, args) {
        message.channel.send("Pong!");
      }
    }
  ]  
}
