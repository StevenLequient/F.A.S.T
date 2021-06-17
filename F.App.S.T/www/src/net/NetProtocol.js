var PROTOCOL = new NetworkEventBundle();

function NetworkEventBundle(){
  //Change the variable value but not the variable name or you'll break stuff
  this.FAST_MINI_GAME_REGISTER = 'FAST_MINI_GAME_REGISTER';
  this.FAST_EVENT_BROADCAST = 'FAST_EVENT_BROADCAST';
  this.FAST_PRIVATE_MINI_GAME_START = 'FAST_PRIVATE_MINI_GAME_START';

  this.FAST_PHONE_CONNECT = 'FAST_PHONE_CONNECT';
  this.FAST_PHONE_OK = 'FAST_PHONE_OK';
  this.FAST_GAME_INIT = 'FAST_GAME_INIT';
  this.FAST_GAME_START = 'FAST_GAME_START';
  this.FAST_GAME_END = 'FAST_GAME_END';
  this.FAST_COLOR = 'FAST_COLOR';
  this.FAST_APP_ERROR = 'FAST_APP_ERROR';
  //Broadcast event PROTOCOL
  this.FAST_EVENT_VIBRATION_WEAK = 'FAST_EVENT_VIBRATION_WEAK';
  this.FAST_EVENT_VIBRATION_MEDIUM = 'FAST_EVENT_VIBRATION_MEDIUM';
  this.FAST_EVENT_VIBRATION_STRONG = 'FAST_EVENT_VIBRATION_STRONG';
  this.FAST_EVENT_LIGHT_OFF = 'FAST_EVENT_LIGHT_OFF';
  this.FAST_EVENT_LIGHT_ON = 'FAST_EVENT_LIGHT_ON';
  this.FAST_EVENT_SOUND_EFFECT = 'FAST_EVENT_SOUND_EFFECT';

  this.FAST_PRIVATE_STOP = 'FAST_PRIVATE_STOP';
  this.FAST_PRIVATE_SYNC = 'FAST_PRIVATE_SYNC';

  //FastMeteor
  this.FAST_GAME_METEOR_EMIT = 'FAST_GAME_METEOR_EMIT';
  this.FAST_GAME_METEOR_DAMAGE = 'FAST_GAME_METEOR_DAMAGE';
  this.FAST_GAME_METEOR_BLOCKED = 'FAST_GAME_METEOR_BLOCKED';

  this.FAST_GAME_BALLISTIC_SHOTS_FIRED = 'FAST_GAME_BALLISTIC_SHOTS_FIRED';

  this.getEmitableEvent = function(){
    return [
      this.FAST_EVENT_BROADCAST,
      this.FAST_PHONE_CONNECT,
      this.FAST_PRIVATE_INIT,
      this.FAST_PRIVATE_STOP,
      this.FAST_PRIVATE_SYNC,
      this.FAST_PRIVATE_START,
      this.FAST_PHONE_CONNECT,
      this.FAST_COLOR
    ];
  }

  this.getReactableEvent = function(){
    return [
      this.FAST_PRIVATE_MINI_GAME_START,
      this.FAST_PRIVATE_INIT,
      this.FAST_PRIVATE_STOP,
      this.FAST_PRIVATE_SYNC,
      this.FAST_PRIVATE_START
    ];
  }

  this.getBroadcastableEvent = function(){
    return [
      this.FAST_EVENT_VIBRATION_WEAK,
      this.FAST_EVENT_VIBRATION_MEDIUM,
      this.FAST_EVENT_VIBRATION_STRONG,
      this.FAST_EVENT_LIGHT_OFF,
      this.FAST_EVENT_LIGHT_ON,
      this.FAST_EVENT_SOUND_EFFECT
    ];
  }

  this.getPrivatableEvent = function(){
    return [

    ];
  }

}
