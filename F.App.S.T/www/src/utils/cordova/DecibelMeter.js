var DECIBELMETER;

function DecibelMeter(){

  this.decibelSignal = new Phaser.Signal();

  var _this = this;

  DBMeter.start(
    function(db){
      _this.decibelSignal.dispatch(db);
    },
    function(err){
      console.log('Decibel error : ' + err );
    }
  );

  this.subscribe = function(callback, context){
    this.decibelSignal.add(callback, context);
  }

  this.unsubscribe = function(callback, context){
    this.decibelSignal.remove(callback, context);
  }

  this.destroy = function(){
    DBMeter.stop(
      function(){
        //If it is stopped we can kill it
        DBMeter.delete(
          function(){
            console.log('destroyed all right');
          },
          function(err){
            console.log('really shouldnt happen');
          }
        );
      },
      function(err){
        console.log('probably not launched anyway');
      }
    );
  }

}
