function SignalRegistry(){

  this.eventCallbackMapReception = [];

  this.eventCallbackMapEmission = [];

  this.addSignalReception = function(keyEvent, signal){
    var fct = function(data){
                if(signal){
                  signal.dispatch(data);
                }
              };
    FastGame.fastSocket.addOnServerCallback(keyEvent, fct);
    this.eventCallbackMapReception[keyEvent] = fct;
  }

  this.removeSignalReception = function(keyEvent){
    if(this.eventCallbackMapReception[keyEvent]){
      FastGame.fastSocket.removeOnServerCallback(keyEvent, this.eventCallbackMapReception[keyEvent]);
      this.eventCallbackMapReception[keyEvent] = undefined;
    }
  }

  this.addSignalEmission = function(keyEvent, signal, context){
    signal.add(
      function(data){
        FastGame.fastSocket.EMIT[keyEvent](data);
      },
      context
    );
    this.eventCallbackMapEmission[keyEvent] = signal;
  }

  this.removeSignalEmission = function(keyEvent){
    this.eventCallbackMapEmission[keyEvent].dispose();
  }

  //try to see if .map works at all
  this.flushAll = function(){
    for(var k in this.eventCallbackMapEmission){
      this.eventCallbackMapEmission[k].removeSignalEmission(k);
    }
    for(var l in this.eventCallbackMapReception){
      this.eventCallbackMapReception[k].removeSignalReception(k);
    }
  }

}
