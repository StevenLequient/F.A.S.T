//Register all phaser signal used with broadcasted event
function EventRegistry(){

    this.relaySignal = new Phaser.Signal();

    this.init = function(){
      this.relaySignal.add(this.eventBroadcastCallback, this);
      FastGame.fastSocket.addBroadcastCallback(PROTOCOL.FAST_EVENT_BROADCAST, this.relaySignal);
      this.callbackArray = [];
    };

    //keyEvent : the event the callback must react to
    this.addCallback = function(keyEvent, callback){
      this.callbackArray[keyEvent] = callback;
    }

    this.removeCallback = function(keyEvent){
      this.callbackArray[keyEvent] = undefined;
    }

    //The server response on event broadcast
    this.eventBroadcastCallback = function(response){
      var data = response.data;
      for(var row in data){
        if(this.callbackArray[data[row].keyEvent]){
            this.callbackArray[data[row].keyEvent](data[row].option);
          }
        }
    }
}
