function FastGyro(){

  var _this = this;

  this.init = function(){
    this.gyroSignal = new Phaser.Signal();
    window.addEventListener("deviceorientation", this.handleOrientation, true);

  };

  this.subscribe = function(callback, context){
    this.gyroSignal.add(callback, context);
  };

  this.handleOrientation = function(e){
    var movData = {
      'x':e.gamma,
      'y':e.beta,
      'z':e.alpha
    };
    _this.gyroSignal.dispatch(movData);
  };
}
