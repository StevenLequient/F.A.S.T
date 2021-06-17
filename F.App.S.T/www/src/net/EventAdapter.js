//Take a given minigame event enum
//add all emitable event as emit to the main socket
//add all onable event as on to the main socket
//When destroy is called, all callback are removed from the socket
function EventAdapter(mgenum, fastSocket){

  this.id = mgenum.id;

  this.SEND = [];

  this.ON = [];

  this.init = () => {
    //add all emit function
    if(mgenum.emit){
      for(emit in mgenum.emit){
        this.SEND[mgenum.emit[emit]] = (data)=>{
          var packet = {
            timestamp: (new Date).getTime(),
            id: mgenum.id,
            data: data
          };
          this.socket.emit(mgenum.emit[emit], packet);
        }
      }
    }

    //prepare to add network event callback
    if(mgenum.on){
      for(onEvt in mgenum.on){
        this.ON[mgenum.on[onEvt]] =  "";
      }
    }
  };


  this.setSocket = (fastSocket) => {
      this.socket = fastSocket;
      this.init();
  };

  this.setSocket(fastSocket);


  this.destroy = function(){
    //First we destroy all "on" callback
    for(evt in this.ON){
      //for each key / callback value, we remove it from the socket to avoid polution
      //Certainly less expensive than creating a new socket every time we change state
      this.removeCallback(evt);
    }
    //Then I guess we do something with EMIT
    //should trigger destruction on next GC (according to the web(since it's js it certainly won't do shit but jey whatever at least i'm trying))
    this.SEND = undefined;
    this.ON = undefined;
  };

  this.addCallback = function(keyEvent, callback, context){
    if((keyEvent && (this.ON[keyEvent] === "")) && callback){
      //we set the function context if one is provided
      console.log("added callback allright");
      if(context){
        callback = callback.bind(context);
      }
      //We now transform the callback to only give data.data as parameter and use the timestamp as we please
      var callbackFinal = (data) => {

        console.log(data);

        //We check once more if the data concerns us
        if(!data){
          callback({});
          return;
        }
        //else if(this.id = data.id){
          //do something with timestamp here
        callback(data);
        //}
      }
      //we add the callback to the on list so as to be able to remove it after
      this.ON[keyEvent] = callbackFinal;
      //We add the callback to the socket
      this.socket.on(keyEvent, callbackFinal);
      return true;
    }
    else{
      return false;
    }
  }

  this.removeCallback = function(keyEvent){
    if(this.ON[keyEvent]){
      this.socket.removeListener(keyEvent, this.ON[keyEvent]);
    }
  }

  this.addBaseEvent = function(){

      for(emit in GAMENETWORKENUM.BASEMINIGAMEEVENT.emit){
        this.SEND[GAMENETWORKENUM.BASEMINIGAMEEVENT.emit[emit]] = (data)=>{
          var packet = {
            timestamp:(new Date).getTime(),
            id: mgenum.id,
            data: data
          };
          this.socket.emit(GAMENETWORKENUM.BASEMINIGAMEEVENT.emit[emit], packet);
        }
      };

      for(onEvt in GAMENETWORKENUM.BASEMINIGAMEEVENT.on){
        this.ON[GAMENETWORKENUM.BASEMINIGAMEEVENT.on[onEvt]] =  undefined;
      };
  }
  if(this.id.startsWith('FAST_GAME_')){
    this.addBaseEvent();
  }
  console.log(this);
}
