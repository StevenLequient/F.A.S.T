FastGame.FastFire = function(game){
  this.game = game;
}
FastGame.FastFire.prototype = {
  init: function(eventAdapter, parameters){
    this.game.stage.disableVisibilityChange = true;

    if(!parameters.game_data){
      parameters = {
        game_data : {
          FAST_GAME_FIRE_RED : 10
        },
        isDemo : true
      }
    }

    this.eventAdapter = eventAdapter;
    this.totalFire = [];
    this.currentFire = [];
    if(parameters.game_data.FAST_GAME_FIRE_RED){
      this.totalFire.red = parameters.game_data.FAST_GAME_FIRE_RED;
    }
    if(parameters.game_data.FAST_GAME_FIRE_GREEN){
      this.totalFire.green = parameters.game_data.FAST_GAME_FIRE_GREEN;
    }
    if(parameters.game_data.FAST_GAME_FIRE_BLUE){
      this.totalFire.blue = parameters.game_data.FAST_GAME_FIRE_BLUE;
    }
    if(parameters.game_data.FAST_GAME_FIRE_PURPLE){
        this.totalFire.purple = parameters.game_data.FAST_GAME_FIRE_PURPLE;
    }
    //FastGame.playerColor = FastGame.playerColor;
    if(!FastGame.playerColor){
      FastGame.playerColor = 'red';
    }
    this.isWin = false;
    this.isLost = false;
    //From Splash / Waiting room screen
    //For now we default everything to true if not defined so as to have a demo ready for this afternoon
    this.isSolo = parameters.isSolo ? parameters.isSolo : true;
    this.isDemo = FastGame.isDemo;
    this.isRoomMaster = true;

    if(!this.isSolo){
      //FastGame.fastSocket.addOnServerCallback(PROTOCOL.FAST_PRIVATE_SYNC, this.synchronize, signal);
      this.eventAdapter.addCallback(PROTOCOL.FAST_PRIVATE_SYNC, this.synchronize, this);
    }

  },
  preload: function(){
    this.game.load.spritesheet('red_fire', './img/flame_sprite.png', 64, 64, 2);
    this.game.load.spritesheet('blue_fire', './img/flame_blue.png', 64, 64, 2);
    this.game.load.spritesheet('purple_fire', './img/flame_purple.png', 64, 64, 2);
    this.game.load.spritesheet('green_fire', './img/flame_green.png', 64, 64, 2);
    this.game.load.image('background', './img/metal_tile.png');
    this.game.load.image('extinguisher','./img/extinguisher_'+FastGame.playerColor+'.png');
    this.game.load.image('white_smoke','./img/white_smoke.png');

    this.decibelMeter = DECIBELMETER;
    this.currentFire.red = this.totalFire.red;
    if(this.totalFire.green){
      this.currentFire.green = this.totalFire.green;
    }
    if(this.totalFire.blue){
      this.currentFire.blue = this.totalFire.blue;
    }
    if(this.totalFire.purple){
      this.currentFire.purple = this.totalFire.purple;
    }
    this.activeFlame = undefined;
  },
  create: function(){
    var _minWidth = 0;
    var _minHeight = 0;
    var _maxWidth = 400;
    var _maxHeight = 170;

    this.game.add.tileSprite( 0, 0, 480, 320, 'background');

    var flameInit = function(flameNumber, assetKey, isExtinguishable, context){
      var flameArray = [];
      for(var i = 0; i <flameNumber; i++){
        var fire = context.game.add.sprite(context.game.rnd.realInRange(_minWidth, _maxWidth), context.game.rnd.realInRange(_minHeight, _maxHeight), assetKey);
        fire.animations.add('burn');
        fire.animations.play('burn', context.game.rnd.realInRange(6,8), true);
        if(isExtinguishable){
          fire.hitpoint = context.game.rnd.realInRange(5,20);
          fire.inputEnabled = true;
          fire.events.onInputOver.add(function(sprite, input){
            context.activeFlame = sprite;
          }, this);
          fire.events.onInputOut.add(function(sprite, input){
            context.activeFlame = undefined;
          }, this);
        }
        flameArray[i] = fire;
      }
      return flameArray;
    };

    this['red'] = flameInit(this.totalFire.red, 'red_fire', (FastGame.playerColor == 'red'), this);
    if(this.totalFire.blue){
      this['blue'] = flameInit(this.totalFire.blue, 'blue_fire', (FastGame.playerColor == 'blue'), this);
    }
    if(this.totalFire.green){
      this['green'] = flameInit(this.totalFire.green, 'green_fire', (FastGame.playerColor == 'green'), this);
    }
    if(this.totalFire.purple){
      this['purple'] = flameInit(this.totalFire.purple, 'purple_fire', (FastGame.playerColor == 'purple'), this);
    }
    var onBlow = function(db){
      if(this.activeFlame){
        if(db >= 65){
          this.whiteParticle.on = true;
          this.activeFlame.hitpoint -= (db/25);
          if(this.activeFlame.hitpoint <= 0){
            var index = this[FastGame.playerColor].indexOf(this.activeFlame);
            this[FastGame.playerColor][index].destroy();
            this[FastGame.playerColor].splice(index,1);
            this.currentFire[FastGame.playerColor]--;
            this.totalFire[FastGame.playerColor]--;
            this.activeFlame = undefined;
            return;
          }
        }
        else{
          this.whiteParticle.on = false;
        }
      }
      else{
        this.whiteParticle.on = false;
      }
    };
    this.decibelMeter.subscribe(onBlow, this);
    this.decibelMeter.destroy = function(){
      this.decibelMeter.unsubscribe(onBlow, this);
    }

    this.whiteParticle = this.game.add.emitter(0,0,20);
    this.whiteParticle.makeParticles('white_smoke');
    this.whiteParticle.setXSpeed(100,130);
    this.whiteParticle.setYSpeed(0,80);
    this.whiteParticle.start(false, 500, 50);
    this.whiteParticle.on = true;


    this.extinguisher = this.game.add.sprite(200, 80, 'extinguisher');
    this.game.input.addMoveCallback(this.onMove, this);
  },
  update: function(){
    var total = 0;

    for(var key in this.totalFire){
      while(this[key].length > this.totalFire[key]){
        this[key].pop().destroy();
        this.currentFire[key]--;
      }
      total += this[key].length;

      if((key === FastGame.playerColor) && this.isSolo){
          if(!this.currentFire[key]){
            this.endGame();
          }
      }

      if(!this.isSolo){
        if(!(this.currentFire['red'] || this.currentFire['blue'] || this.currentFire['green'] || this.currentFire['purple'])){
          this.endGame();
        }
      }
    }
    this.broadcast();
  },
  endGame: function(){
    //FastGame.fastSocket.serverSocket.emit('FAST_FIRE_END');
    this.eventAdapter.SEND[PROTOCOL.FAST_GAME_END]();

    if(this.isDemo){
      FastGame.stateManager.goToState(STATELIST.FAST_SPLASH, {});
      return;
    }

    FastGame.stateManager.goToState(STATELIST.FAST_STATUS_SCREEN, {});
  },
  destroy: function(){
    this.decibelMeter.destroy();
    this.activeFlame = undefined;
    this['red'] = undefined;
    this['blue'] = undefined;
    this['green'] = undefined;
    this['purple'] = undefined;

    this.totalFire = undefined;
    this.currentFire = undefined;
  },
  onMove: function(pointer){
    this.extinguisher.x = pointer.x-45;
    this.extinguisher.y = pointer.y-20;
    this.whiteParticle.x = pointer.x+40;
    this.whiteParticle.y = pointer.y-5;
  },
  broadcast: function(){
    var data = [];
    if(FastGame.playerColor === 'red'){
      data = { 'FAST_GAME_FIRE_RED' : this.totalFire['red']};
    }
    if(FastGame.playerColor === 'blue'){
      data = { 'FAST_GAME_FIRE_BLUE' : this.totalFire['blue']};
    }
    if(FastGame.playerColor === 'green'){
      data = { 'FAST_GAME_FIRE_GREEN' : this.totalFire['green']};
    }
    if(FastGame.playerColor === 'purple'){
      data = { 'FAST_GAME_FIRE_PURPLE' : this.totalFire['purple']};
    }
    FastGame.fastSocket.EMIT[PROTOCOL.FAST_PRIVATE_SYNC](data);
  },
  synchronize: function(data){
    if(data.FAST_GAME_FIRE_RED >= 0){
      this.totalFire.red = data.FAST_GAME_FIRE_RED;
    }
    if(data.FAST_GAME_FIRE_BLUE >= 0){
      this.totalFire.blue = data.FAST_GAME_FIRE_BLUE;
    }
    if(data.FAST_GAME_FIRE_GREEN >= 0){
      this.totalFire.green = data.FAST_GAME_FIRE_GREEN;
    }
    if(data.FAST_GAME_FIRE_PURPLE >= 0){
      this.totalFire.purple = data.FAST_GAME_FIRE_PURPLE;
    }
  }
}
