FastGame.Fallback = function(game){
  this.game = game;
}

FastGame.Fallback.prototype = {
  init: function(eventAdapter, parameters){
    //nill
  },
  preload: function() {
    //nill
  },
  create: function() {
    //i cant let you do that . mp3
    //FastGame.stateManager.goToState(STATELIST.FAST_STATUS_SCREEN, { error : true });
  },
  update: function() {

  }
};
