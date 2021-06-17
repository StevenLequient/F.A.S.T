FastGame.FastSwitch = function(game){
  this.game = game;
}
FastGame.FastSwitch.prototype = {
  init: function(eventAdapter, parameters){
    this.eventAdapter = eventAdapter;

    if(!parameters){
      parameters = {};
      parameters.isDemo = true;
    }
    console.log(parameters);
    this.isDemo = FastGame.isDemo;
    console.log('Is demo : ' + this.isDemo);
  },
  preload: function(){
    this.game.load.image('background', './img/metal_tile.png');
    this.game.load.image('switch', './img/switch.png');
    this.game.load.image('mask', './img/mask.png');
  },
  create: function(){
    this.game.add.tileSprite( 0, 0, 480, 320, 'background');
    var _minWidth = 0;
    var _minHeight = 0;
    var _maxWidth = 400;
    var _maxHeight = 170;

    var _switchHeight = 50;
    var _switchWidth = 50;

    var xSwitch = this.game.rnd.integerInRange(_minWidth, _maxWidth);
    var ySwitch = this.game.rnd.integerInRange(_minHeight, _maxHeight);

    var swtch = this.game.add.sprite(xSwitch, ySwitch, 'switch');

    this.xImpact = xSwitch + _switchWidth / 2;
    this.yImpact = ySwitch + _switchHeight / 2;
    swtch.inputEnabled = true;
    swtch.events.onInputDown.add(function(){
      this.endGame();
    }, this);

    this.mask = this.game.add.sprite(0,0, 'mask');


    this.game.input.addMoveCallback(this.checkDistance, this);
  },
  update: function(){

  },
  destroy: function(){

  },
  endGame: function(){
    this.mask.destroy();
    this.eventAdapter.SEND[PROTOCOL.FAST_GAME_END]();
    var nextState = this.isDemo ? STATELIST.FAST_SPLASH : STATELIST.FAST_STATUS_SCREEN;
    console.log('Switch next state : ' + nextState);
    this.game.time.events.add(1000, function(){FastGame.stateManager.goToState(nextState,{})}).autoDestroy = true;
  },
  checkDistance: function(pointer){
    var dist = function(ax, ay, bx, by){
        var a = ax - bx;
        var b = ay - by;
        return c = Math.sqrt( a*a + b*b );
      };

      var distance = dist(this.xImpact, this.yImpact, pointer.x, pointer.y);
      var buffer = '';
      for(i = 0; i < distance / 2; i++){
        buffer += '|';
      }
      //console.log(buffer);

      var baseTime = 100;
      var vibrationStrength;


      if(distance > 25 && distance < 80){
        this.lastState = this.currentState;
        this.currentState = 1;
        baseTime = 500;
        vibrationStrength = 0.5;
      }
      else if(distance <= 25){
        this.lastState = this.currentState;
        this.currentState = 0;
        baseTime = 1000;
        vibrationStrength = 0;
      }
      else{
        this.lastState = this.currentState;
        this.currentState = 2;
        baseTime = 250;
        vibrationStrength = 0.25;
      }
      var computedDuration = baseTime * (1 - vibrationStrength);
      if(this.lastState != this.currentState){
        this.isVibrating = false;
        navigator.vibrate([]);
      }
      if(!this.isVibrating){
        navigator.vibrate(computedDuration);
        this.isVibrating = true;
        this.game.time.events.add(1000, function(){this.isVibrating = false}, this).autoDdestroy = true;
      }
      this.targetDistancce = distance;
  }
}
