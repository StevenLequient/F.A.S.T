function Broadcaster(){

  this.broadcastUtils = new BroadcastUtils();

  this.init = function(){
    var broadcastable = PROTOCOL.getBroadcastableEvent();
    for(var evt in broadcastable){
      let e = broadcastable[evt];
      if(this.broadcastUtils[e]){
        FastGame.eventRegistry.addCallback(e, this.broadcastUtils[e]);
        this[e] = function(option){
          FastGame.fastSocket.EMIT[PROTOCOL.FAST_EVENT_BROADCAST]([{'keyEvent':e,'option':option}]);
          this.broadcastUtils[e](option);
        }
      }
    }
  }
}
