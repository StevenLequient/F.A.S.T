function BroadcastUtils(){

    var WEAK_STRENGTH = 100;
    var MEDIUM_STRENGTH = 500;
    var STRONG_STRENGTH = 1000;

    var _this = this;

    this[PROTOCOL.FAST_EVENT_VIBRATION_WEAK] = function(){
      _this.vibrate(WEAK_STRENGTH);
    }

    this[PROTOCOL.FAST_EVENT_VIBRATION_MEDIUM] = function(){
      _this.vibrate(MEDIUM_STRENGTH);
    }

    this[PROTOCOL.FAST_EVENT_VIBRATION_STRONG] = function(){
      _this.vibrate(STRONG_STRENGTH);
    }

    this.vibrate = function(duration){
      navigator.vibrate(duration);
    }

}
