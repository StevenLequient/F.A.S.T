FastGame.SplashScreen = function(game){
}
FastGame.SplashScreen.prototype = {
  init: function(eventAdapter, parameters){

    if(!parameters){
      var k = this.game.rnd.integerInRange(0,2);
      parameters.GAME = this.gameDatas[k].mini_game
    }

    this.gameDatas = []
    this.gameDatas.push({'mini_game': STATELIST.FAST_GAME_FIRE, 'game_data':{'FAST_GAME_FIRE_RED': 10}});
    this.gameDatas.push({'mini_game': STATELIST.FAST_GAME_METEOR, 'game_data':{'FAST_GAME_METEOR_TOTAL': 10}});
    this.gameDatas.push({'mini_game': STATELIST.FAST_GAME_SWITCH, 'game_data':{}});

    if(!parameters.GAME){
      var k = this.game.rnd.integerInRange(0,2);
      parameters.GAME = this.gameDatas[k].mini_game
    }

    this.splashIcons = (new SplashEnum())[parameters.GAME] || [];
    this.commingMiniGame = parameters.GAME ? parameters.GAME : undefined;
    this.game.stage.disableVisibilityChange = true;
    this.isSolo = parameters.isSolo ? parameters.isSolo : true;
    this.isDemo = parameters.isDemo ? parameters.isDemo : true;
    this.eventAdapter = eventAdapter;
    if(!this.isSolo){
      //var signal = new Phaser.Signal();
      //signal.add(this.goToMiniGame, this);
      //FastGame.fastSocket.addOnServerCallback(PROTOCOL.FAST_PRIVATE_START, this.goToMiniGame, signal);
      this.eventAdapter.addCallback(PROTOCOL.FAST_GAME_START, this.goToMiniGame, this);
    };

      //var minigameSignal = new Phaser.Signal();
      //minigameSignal.add(function(minigame){FastGame.stateManager.goToState(STATELIST[minigame], {minigame, isSolo : true, isDemo : false})}, this);
      //FastGame.fastSocket.addOnServerCallback(STATELIST.FAST_GAME_FIRE, (minigame)=>{FastGame.stateManager.goToState(STATELIST[minigame],  {minigame, isSolo : true, isDemo : false})}, minigameSignal);

  },
  preload: function(){
    for(var file in this.splashIcons){
      this.game.load.image(this.splashIcons[file][0], this.splashIcons[file][1]);
      if(this[this.splashIcons[file][0]]){
        this[this.splashIcons[file][0]]();
      }
    }
    this.game.load.image('background', './img/splash_background.jpg');
    this.game.load.image('star_layer', './img/splash_parallax_layer.png');
    this.game.load.image('star_layer_2', './img/splash_parallax_layer_2.png');
    this.game.load.image('planet_layer', './img/space_mosaic.png');
    for(var i = 0; i <= 9; i++){
      this.game.load.image('planet'+i, './img/planet'+i+'.png');
    }
    //this.game.load.audio('title', './sounds/title.mp3');
    FastGame.fastSound.loadSound('./sounds/title.mp3', 'title', true);

    //We do know every splash icon is 100*100 so we can assume its size for layout facilitation
    this._iconWidth = 100;
    this._backgroundSpeedBound = 0.1;
    this._mediumLayerSpeedBound = 0.3;
    this._frontLayerSpeedBound = 0.5;
    this._planetLayerSpeedBound = 0.7;
    this.scaleValue = 1;
    this.splashFont = { font: '24px Arial', fill: '#ffffff', stroke: '#000000', strokeThickness: '10' };

  },
  create: function(){
    //this.game.stage.backgroundColor = '#FFFFFF';
    //Order matter
    this.background = this.game.add.tileSprite(0, 0, 480, 320, 'background');
    this.backgroundAcceleration = this._backgroundSpeedBound;
    this.mediumLayer = this.game.add.tileSprite(0, 0, 480, 320, 'star_layer');
    this.mediumLayerAcceleration = this._mediumLayerSpeedBound;
    this.frontLayer = this.game.add.tileSprite(0, 0, 480, 320, 'star_layer_2');
    this.frontLayerAcceleration = this._frontLayerSpeedBound;
    this.planetLayer = this.game.add.tileSprite(0, 0, 2100, 320, 'planet_layer');
    this.planetLayerAcceleration = this._planetLayerSpeedBound;

    this.planets = [];

    var availableSpace = (FastGame._WIDTH) / this.splashIcons.length;
    var splashTargetCenter = FastGame._HEIGHT * 0.3;
    var textTargetCenter = splashTargetCenter + 150;
    var offset = 0;
    var margin = (availableSpace - this._iconWidth) / 2;
    //Let's prevent that from hapenning
    if(margin < 0){
      margin = 0;
    }
    for(var file in this.splashIcons){
      offset += margin;
      this.game.add.sprite(offset, splashTargetCenter, this.splashIcons[file][0]);
      this.game.add.text(offset, textTargetCenter, this.splashIcons[file][0], this.splashFont);
      //		this.timerText = this.game.add.text(15, 15, "Time: "+this.timer, this.fontBig);
      offset += (this._iconWidth + margin);
    }

    //random offset for layers
    this.background.tilePosition.x += this.game.rnd.realInRange(0, 480);
    this.mediumLayer.tilePosition.x += this.game.rnd.realInRange(0, 480);
    this.frontLayer.tilePosition.x += this.game.rnd.realInRange(0, 480);
    this.planetLayer.tilePosition.x += this.game.rnd.realInRange(0, 2100);

    if(this.isDemo){
      this.game.input.onHold.add(function(){
        //this.scaleValueUpper = 1.1;
        this.goToMiniGame();
      },this);
    }
    FastGame.fastSound.playMusic('title');
  },
  update: function(){
    this.background.tilePosition.x += this.backgroundAcceleration;
    this.mediumLayer.tilePosition.x += this.mediumLayerAcceleration;
    this.frontLayer.tilePosition.x += this.frontLayerAcceleration;
    this.planetLayer.tilePosition.x += this.planetLayerAcceleration;

    if(this.planets.length > 0){
      for(var i = 0; i < this.planets.length; i++){
        this.planets[i].x += 1;
        if(this.planets[i].x > 600){
          this.planets[i].x = -100;
        }
      }
    }

  },
  render: function(){
  },
  destroy: function(){
    //Tentative to manage memory, apparently the engine designer didn't find it useful to allow for manual memory management of assets
    // "Put it in an iFrame, juste like flash object. Loading a game within an iframe is not that bad and you don't have to worry about memory" SebastianNette, expert member
    this._iconWidth = undefined;
    this.splashFont = undefined;
    this.background = undefined;
    this.mediumLayer = undefined;
    this.frontLayer = undefined;
    this.planetLayer = undefined;
    this.splashIcons = undefined;
    this.commingMiniGame = undefined;

    this.backgroundAcceleration = undefined;
    this.mediumLayerAcceleration = undefined;
    this.frontLayerAcceleration = undefined;
    this.planetLayerAcceleration = undefined;

    this._backgroundSpeedBound = undefined;
    this._mediumLayerSpeedBound = undefined;
    this._frontLayerSpeedBound = undefined;
    this._planetLayerSpeedBound = undefined;

    this.scaleValue = undefined;
    this.decibelMeter.destroy();
  },
  goToMiniGame: function(launchData){

      if(launchData){
        this.commingMiniGame = launchData.GAME;
        this.isDemo = launchData.isDemo;
      }

      if(this.commingMiniGame){
        //TODO : add mini game related data (meteor in particular)
        FastGame.stateManager.goToState(this.commingMiniGame, {isDemo : this.isDemo});
        return;
      }
      FastGame.stateManager.goToState(this.gameDatas[this.commingMiniGame].mini_game, { game_data : this.gameDatas[this.commingMiniGame].game_data, minigame : this.gameDatas[this.commingMiniGame].mini_game, isSolo : true });
      return;
  },
  BLOW: function(){
    var faster = function(db){
    if(db > 75){
      this.backgroundAcceleration += (db / 400);
      this.mediumLayerAcceleration += (db / 300);
      this.frontLayerAcceleration += (db / 250);
      this.planetLayerAcceleration += (db / 175);
    }
    else{
      if((this.backgroundAcceleration - (db / 100)) >= this._backgroundSpeedBound){
        this.backgroundAcceleration -= (db / 200);
      }
      else{
        this.backgroundAcceleration = this._backgroundSpeedBound;
      }
      if((this.mediumLayerAcceleration - (db / 100)) >= this._mediumLayerSpeedBound){
        this.mediumLayerAcceleration -= (db / 150);
      }
      else{
        this.mediumLayerAcceleration = this._mediumLayerSpeedBound;
      }
      if((this.frontLayerAcceleration - (db / 100)) >= this._frontLayerSpeedBound){
        this.frontLayerAcceleration -= (db / 150);
      }
      else {
        this.frontLayerAcceleration = this._frontLayerSpeedBound;
      }
      if((this.planetLayerAcceleration - (db / 100))>= this._planetLayerSpeedBound){
        this.planetLayerAcceleration -= (db / 125);
      }
      else{
        this.planetLayerAcceleration = this._planetLayerSpeedBound;
      }
    }
    }
    this.decibelMeter = DECIBELMETER;
    this.decibelMeter.subscribe(faster, this);
    this.decibelMeter.destroy = function(){
      this.decibelMeter.unsubscribe(faster, this);
    }
  },
  TOUCH: function(){
    this.game.input.onDown.add(function(pointer){
      var plt = this.game.rnd.integerInRange(0,9);
      //this.planets.push(this.game.add.sprite(pointer.x, pointer.y, 'planet'+plt));
    },this);
  },
  FEEL: function(){
    this.xImpact = 240;
    this.yImpact = 160;
    this.game.input.addMoveCallback(this.checkDistance, this);
  },
  TILT: function(){
    this.gyro = new FastGyro();
    this.gyro.init();
    this.gyro.subscribe(this.handleOrientation, this);
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
  },
	handleOrientation: function(e) {
    if(e.y >= 0){
      this.backgroundAcceleration += e.y * 0.02;
      this.mediumLayerAcceleration += e.y * 0.02;
      this.frontLayerAcceleration += e.y * 0.02;
      this.planetLayerAcceleration += e.y * 0.02;
    }
    else{
      this.backgroundAcceleration -= e.y * 0.02;
      this.mediumLayerAcceleration -= e.y * 0.02;
      this.frontLayerAcceleration -= e.y * 0.02;
      this.planetLayerAcceleration -= e.y * 0.02;
    }
	}
}
