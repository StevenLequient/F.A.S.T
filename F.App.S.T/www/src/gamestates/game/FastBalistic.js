FastGame.FastBalistic = function(game){
  this.game = game;
}
FastGame.FastBalistic.prototype = {
  init: function(eventAdapter, parameters){
    this.eventAdapter = eventAdapter;
  },
  preload: function(){
    
  },
  create: function(){
     var style = { font: "32px Arial", fill: "#00FF00" };
     this.label = this.game.add.text(10, 75, 'T A R G E T  A C Q U I R E D', style);
     this.damage = this.game.add.text(175, 120, '&&&', style);
     this.eventAdapter.addCallback(PROTOCOL.FAST_GAME_BALLISTIC_SHOTS_FIRED, this.updateDamage, this);
  },
  update: function(){

  },
  destroy: function(){

  },
  endGame: function(){

  },
  updateDamage: function(data){
    this.damage.text = data.PREC;
  }
}
