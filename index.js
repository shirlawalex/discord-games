// Require (module,files)
const { Discord, fs, arrayOfFile } = require(`./util/function.js`)
const ClientFct = require("./util/client.js");
const config = require(`./config.json`);
const {loadCommands, loadEvents} = require ("./util/loader.js");

// Initialisation and new Proprieties
const bot = new Discord.Client();
ClientFct(bot); //add to bot method and parameters 
// require("./util/client")(bot);



// import JSON file: the text content and put in a Collection
const jsonPath =  arrayOfFile('./json','.json',true);
jsonPath.forEach( pathFile => {
  const key = pathFile.split("/").pop().slice(0,-5);
  bot.jsonFiles.set(key,JSON.parse(fs.readFileSync(pathFile)));
});



loadEvents(bot);
loadCommands(bot);

// start the database
bot.mongoose.init(bot.dblocal)


bot.testlog()

//Connect bot
bot.login(config.token)
