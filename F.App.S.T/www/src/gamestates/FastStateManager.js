function FastStateManager(game, socket){

  this.socket = socket;

  this.game = game;

  this.killSignal = undefined;

  this.currentEventAdapter = undefined;

  this.errorManagement = (param) => {
      console.log('FAST STATE MANAGER RECEIVED ERROR : ' + param);
      this.goToState(STATELIST.FAST_FALLBACK, { error : true });
  };

  //window.onerror = this.errorManagement;

  this.goToState = function(state, param){
    //Control if state exist
    if(this.game.state.checkState(state)){
      //destroy old eventAdapter
      if(this.currentEventAdapter){
        console.log(this.currentEventAdapter);
        this.currentEventAdapter.destroy();
        console.log('destroyed current event Adapter');
        this.currentEventAdapter = undefined;
      }
      //Create new eventAdapter
      console.log('Central socket: ' + this.socket);
      this.currentEventAdapter = new EventAdapter(GAMENETWORKENUM[state], FastGame.fastSocket.serverSocket);

      if(this.killSignal){
        this.killSignal.dispose();
      }
      this.killSignal = undefined;
      this.killSignal = new Phaser.Signal();

      this.killSignal.addOnce(this.goToState, this);

      //go to next state
      //first true is clear gameWorld (need some precisions)
      //second true is clear game cache (we want this)
      this.game.state.start(state, true, true, this.currentEventAdapter, param);
      //For what it's worth, state start doesn't actually do anything so we have to return true to avoid going exactly where I thought we wouldn't go
      return true;
    }
    //may throw some error or do somthing really, but I expect it not to happen
    console.error('State ' + state + ' not found, aborting state switch');
    return false;
  };


}
