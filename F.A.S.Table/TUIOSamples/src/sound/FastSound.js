
function FastSound(game){

  this.game = game;

  this.currentMusic = undefined;

  this.assets = [];

  this.loadSound = function(filePath, id, isMusic){
    this.game.load.audio(id,filePath);
    this.game.input.touch.preventDefault = false;
  };

  this.playMusic = function(id){
    if(this.assets[id]){
      if(this.currentMusic){
        this.currentMusic.stop();
      }
      this.currentMusic = this.assets[id];
      this.currentMusic.play();
    }
    else{
      var signal = new Phaser.Signal();
      this.assets[id] = this.game.add.audio(id);
      signal.add(function(id){this.playMusic(id)}, this);
      this.game.sound.setDecodedCallback(this.assets[id], function(){
          signal.dispatch(id);
        }, this);
      };
  };

  this.playSound = function(id){
    if(this.assets[id]){
      this.assets[id].play();
    }
  };
}
