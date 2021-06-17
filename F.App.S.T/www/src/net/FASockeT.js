var P2P_PORT = 6969;
var EVENT_BROADCAST_PORT = 1214;
var SERVER_PORT = 8080;
var HTTP_MODE = "http://";

//Object are stringified upon emission
//Object are parsed upon callback call
function FASockeT(){

  this.p2pPort = P2P_PORT;
  this.eventPort = EVENT_BROADCAST_PORT;
  this.serverPort = SERVER_PORT;
  this.httpMode = HTTP_MODE;

  this.EMIT = [];

  var opts = {peerOpts: {trickle: false}, autoUpgrade: false};

  this.init = function(ip){
    this.serverSocket = io(this.httpMode + ip + ':' + this.serverPort, {
        reconnection: false
    });
    var signal = new Phaser.Signal();
    var _this = this;

    this.serverSocket.on('connect', function () {
      //TODO : change this
      //TEMPORARY
      _this.broadcastSocket = _this.serverSocket;

      //Add server behavior
      _this.addOnServerCallback(PROTOCOL.FAST_MINI_GAME_REGISTER, _this.startP2PSession);

      var emitable = PROTOCOL.getEmitableEvent();

      for(var evt in emitable){
        _this.addEmitServerBehavior(emitable[evt]);
      }
      _this.serverIp = ip;
      signal.dispatch(true);
    });

    this.serverSocket.on('disconnect', function () {
        signal.dispatch(false);
    });

    this.serverSocket.on('connect_failed', function () {
        signal.dispatch(false);
    });

    this.serverSocket.on('error', function () {
        signal.dispatch(false);
    });

    return signal;
  }

  //keyword : string, behavior : function
  this.addEmitServerBehavior = function(keyword){
    this.EMIT[keyword] = (data) => {
      this.serverSocket.emit(keyword, data);
    };
  }
  //keyword : string, callback : function
  this.addOnServerCallback = function(keyword, callback, signal){
    if(signal){
      this.serverSocket.on(keyword, function(data){
        signal.dispatch(data);
      });
    }
    else{
      this.serverSocket.on(keyword, function(data){
        callback(data);
      });
    }
  }

  this.removeOnServerCallback = function(keyword, callback){
    this.serverSocket.removeListener(keyword, callback);
  }

  //keyEvent : string, phaserSignal : Phaser.Signal
  this.addBroadcastCallback = function(keyEvent, phaserSignal){
    this.broadcastSocket.on(keyEvent, function(data){
      if(phaserSignal.dispatch){
        phaserSignal.dispatch({'data' : data});
      }
    });
  }

  //room : string
  this.startP2PSession = function(room){
    //is room usefull????
    this.p2psocket.upgrade();
  }

}
