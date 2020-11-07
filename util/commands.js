
start = {
  name : 'start',
  parent : 'game',
  default : "", 
  args : false,
  usage :  '',
  type : "settings",
  description: 'start the game',
  execute(bot,game,message,args, settings) {
    game.action();
  }
};

exports.start = start;


