FastGame.FastMeteor = function(game){
  this.game = game;
}
FastGame.FastMeteor.prototype = {
  init: function(eventAdapter, parameters){

    if(!parameters.game_data){
      parameters = {
        game_data : {
          'FAST_GAME_METEOR_TOTAL' : 10,
          'room' : 1
        },
        isDemo : true
      };
    }

    this.gyro = new FastGyro();
    this._totalMeteor = parameters.game_data.FAST_GAME_METEOR_TOTAL || 10;
    this.isDemo = FastGame.isDemo;
    this.eventAdapter = eventAdapter;
    this.room = parameters.room;
  },
  preload: function(){

    this.gyro.init();
    this.game.load.image('meteor', './img/meteor.png');
    this.game.load.image('paddle', './img/paddle.png');
    this.game.load.image('limit', './img/death_line.png');

    this.game.load.image('background', './img/splash_background.jpg');

  },
  create: function(){
    this.background = this.game.add.tileSprite(0, 0, 480, 320, 'background');
    this.background.tilePosition.x += this.game.rnd.realInRange(0, 480);
    this.meteorData = [];
    for(i = 0; i < this._totalMeteor; i++){
      this.meteorData.push({'x': this.game.rnd.integerInRange(0,480), 'y': -50, 'xVel': this.game.rnd.integerInRange(0, 0), 'yVel': this.game.rnd.integerInRange(100, 125)});
    }

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.paddle = this.game.add.sprite(225, 235, 'paddle');
    this.limit = this.game.add.sprite(0, 380, 'limit');


    this.gyro.subscribe(this.handleOrientation, this);
  },
  update: function(){

    if(!this.meteor){
      this.addNewMeteor();
    }
    this.background.tilePosition.x += 0.1;
    if(this.tempX){
      this.paddle.x = this.tempX;
      this.tempX = undefined;
    }
    if(this.meteor){
      if(this.checkMeteorOverlap(this.meteor, this.paddle)){
        this.paddleColision();
      }
      else if(this.checkMeteorOverlap(this.meteor, this.limit)){
        this.shipColision();
      }
    }

  },
  destroy: function(){

  },
	handleOrientation: function(e) {
    if(e.y >= 0){
      if(this.paddle.x < 440){
        this.tempX = this.paddle.x + 9;
      }
    }
    else{
      if(this.paddle.x >= 9){
        this.tempX = this.paddle.x - 9;
      }
    }
	},
  paddleColision: function(){
    if(this.meteor){
      this.meteor.destroy();
      this.meteor = undefined;
      this.eventAdapter.SEND[PROTOCOL.FAST_GAME_METEOR_BLOCKED]();
    }
  },
  shipColision: function(){
    if(this.meteor){
      this.meteor.destroy();
      this.meteor = undefined;
      //Add bvvr event
      FastGame.broadcastChannel[PROTOCOL.FAST_EVENT_VIBRATION_STRONG]();
      this.eventAdapter.SEND[PROTOCOL.FAST_GAME_METEOR_DAMAGE]();
    }
  },
  addNewMeteor: function(){

    if(this.meteorData.length === 0){
      this.endGame();
    }
    else{
      this.meteor = this.game.add.sprite(this.meteorData[this.meteorData.length - 1].x, this.meteorData[this.meteorData.length - 1].y, 'meteor');
      this.game.physics.arcade.enable(this.meteor);
      this.meteor.body.velocity.setTo(this.meteorData[this.meteorData.length - 1].xVel, this.meteorData[this.meteorData.length - 1].yVel);
      this.meteorData.pop();
      //TODO : UP OR DOWN down here it goes
      this.eventAdapter.SEND[PROTOCOL.FAST_GAME_METEOR_EMIT]({room : this.room});
    }
  },
  checkMeteorOverlap: function(objectA, objectB){
    try{
      var boundsA = objectA.getBounds();
      var boundsB = objectB.getBounds();
      return Phaser.Rectangle.intersects(boundsA, boundsB);
    }
    catch(err){
      return false;
    }
  },
  endGame: function(param){
    this.eventAdapter.SEND[PROTOCOL.FAST_GAME_END]();
    if(this.isDemo){
      FastGame.stateManager.goToState(STATELIST.FAST_SPLASH, {});
      return;
    }
    FastGame.stateManager.goToState(STATELIST.FAST_STATUS_SCREEN, param);
  }
}
