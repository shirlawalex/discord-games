const mongoose = require("mongoose");
const {DBCONNECTIONLOCAL,DBCONNECTIONONLINE} = require("../config");


module.exports = {
  init : (dblocal) => {
    const mongOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      autoIndex: false, // Don't build indexes
      poolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    };

    /*
    try {
      mongoose.connect(DBCONNECTIONONLINE, mongOptions);
    } catch (error) {
      console.error("Erreur connection en ligne, tentative en local")
      mongoose.connect(DBCONNECTIONLOCAL, mongOptions);
    } 
    */
    
    if(dblocal){
      mongoose.connect(DBCONNECTIONLOCAL, mongOptions).catch(err => {
        console.error(err.stack);
        process.exit(1);
      });
    }else{
      mongoose.connect(DBCONNECTIONONLINE, mongOptions).catch(err => {
        console.error("App starting error:  One common reason is that you're trying to access the database from an IP that isn't whitelisted. The connection may be public, use private connection or local database. \nTry to connect in local...");
        dblocal = true;
        mongoose.connect(DBCONNECTIONLOCAL, mongOptions).catch(err => {
          console.error(err.stack);
          process.exit(1);
        });
      });
    }
    
    mongoose.Promise = global.Promise;
    mongoose.connection.on("connected", () => console.log(`database connected ${dblocal ? `\"local\"` : `\"online\"`}`))
    
  }
}

