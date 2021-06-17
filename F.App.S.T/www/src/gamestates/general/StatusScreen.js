FastGame.StatusScreen = function(game){
  this.game = game;
}

FastGame.StatusScreen.prototype = {
  init: function(eventAdapter, parameters){
    this.eventAdapter = eventAdapter;
    if(!FastGame.playerColor){
      FastGame.playerColor = parameters.color ? parameters.color : 'purple';
    }
  },
  preload: function() {
    this.game.load.image('player', './img/'+FastGame.playerColor+'_char.png');
  },
  create: function() {
    this.eventAdapter.addCallback(PROTOCOL.FAST_GAME_INIT, this.goToNextScreen, this);

    var filterColor = "gl_FragColor = vec4( c, 0.0, c, 1.0 );";

    if(FastGame.playerColor === 'red'){
      filterColor = "gl_FragColor = vec4( c, 0.0, 0.0, 1.0 );";
    }else if(FastGame.playerColor === 'blue'){
      filterColor = "gl_FragColor = vec4( 0.0, 0.0, c, 1.0 );";
    }else if(FastGame.playerColor === 'green'){
      filterColor = "gl_FragColor = vec4( 0.0, c, 0.0, 1.0 );";
    }else if(FastGame.playerColor === 'purple'){
      filterColor = "gl_FragColor = vec4( c, 0.0, c, 1.0 );";
    }

    var fragmentSrc = [

        "precision mediump float;",

        "uniform float     time;",
        "uniform vec2      resolution;",


        "void main( void ) {",

            "vec2 normalPos = gl_FragCoord.xy / resolution.xy;",
            "float pos = (gl_FragCoord.y / resolution.y);",

            "float c = sin(pos * 400.0) * 0.4 + 0.4;",
            "c = pow(c, 0.2);",
            "c *= 0.2;",
            "// noise",
            filterColor,
        "}"
    ];

    this.filter = new Phaser.Filter(this.game, null, fragmentSrc);
    this.filter.setResolution(120, 80);

    this.sprite = this.game.add.sprite();
    this.sprite.width = 480;
    this.sprite.height = 320;

    this.sprite.filters = [ this.filter ];

    this.playerPortrait = this.game.add.sprite(0,0,'player');
  },
  update: function() {
    this.filter.update();
  },
  goToNextScreen: function(data){
    FastGame.stateManager.goToState(data.GAME, data);
  }
};
