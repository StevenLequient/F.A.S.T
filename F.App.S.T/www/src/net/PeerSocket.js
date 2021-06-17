
function PeerSocket(){

  this.init = function(){
    var opts = {peerOpts: {trickle: false, numClients: 2}, autoUpgrade: false};
    this.signalRelay = new Phaser.Signal();
    this.p2psocket = new P2P(FastGame.fastSocket.serverSocket, opts, (res) => {
      this.signalRelay.dispatch();
    });

    this.p2psocket.on('peer-msg', function(data){
    });

    this.p2psocket.on('go-private', function(data){
    });

    var proto = PROTOCOL.getPrivatableEvent();
    for(var key in proto){
      this[proto[key]] = [];
      this[proto[key]].channel = new Phaser.Signal();
      this[proto[key]].emit = (data)=>{
        this.p2psocket.emit(proto[key], this.addHeader(data));
      };
      this[proto[key]].on = (data)=>{
        //TODO : use timestamp
        this[key].channel.dispatch(data.data);
      };
      this.p2psocket.on(this[proto[key]], this[proto[key]].on)
    }
    return this.signalRelay;
  }

  this.upgrade = function(){
    this.p2psocket.upgrade();
  }

  this.addHeader = function(data){

    return {
      'timestamp' : Date.now(),
      'data' : data
    }

  }


}
