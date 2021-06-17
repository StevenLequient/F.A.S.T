var FastTable = {
	_WIDTH: 1920,
	_HEIGHT: 1080
};
FastTable.TitleScreen = function(game) {
  this.game = game;
  this._roomHeight = 250;
  this._roomWidth = 250;
  this.fastSound = new FastSound(game);
};
FastTable.TitleScreen.prototype = {
  init: function() {
		this.game.stage.disableVisibilityChange = true;
  },
	preload: function() {
    this.game.load.image('background', './src/img/splash_background.jpg');
    this.game.load.image('star_layer', './src/img/splash_parallax_layer.png');
    this.game.load.image('star_layer_2', './src/img/splash_parallax_layer_2.png');

    this.game.load.image('logo', './src/img/logo.png');
    this.game.load.image('startUp', './src/img/press_start_up.png');
    this.game.load.image('startDown', './src/img/press_start_down.png');


    this.fastSound.loadSound('src/sound/music/title.mp3', 'title', true);

    this.game.load.image('room', 'src/img/room.png');
  },
	create: function() {
    //this.background = this.game.add.tileSprite(0, 0, 1920, 1080, 'background');
    //this.mediumLayer = this.game.add.tileSprite(0, 0, 1920, 1080, 'star_layer');
    //this.frontLayer = this.game.add.tileSprite(0, 0, 1920, 1080, 'star_layer_2');

    this.createGalaxy();

    this.logo = this.game.add.sprite(560, 320, 'logo');
    this.startUp = this.game.add.sprite(616,250,'startUp');
    this.startDown = this.game.add.sprite(616,740,'startDown');
    this.fastSound.playMusic('title');

        //this.logo.events.onInputOver.add(this.ppp, this);

        //this.game.input.onTap.add(this.ppp, this);
        //this.game.input.onDown.add(this.ppp, this);

        this.logo.inputEnabled = true;
        this.logo.events.onInputOver.add(this.ppp, this);


        this.game.time.events.loop(Phaser.Timer.HALF, this.blinkSprite, this);

/*    this.room = this.frontLayer;
    this.room = this.game.add.tileSprite(0, 0, 1920, 1080, 'room1');
    this.room.inputEnabled = true;
        this.room.alpha = 0.5;
        this.room.anchor.set(0.5);
        this.game.input.addMoveCallback(this.p, this);*/

        //this.game.events.onInputDown.add(this.p, this);*/

    },
    createGalaxy: function(){
      console.log('create galaxy');
/*        var fragmentSrc = [

            "precision mediump float;",

            "uniform float     time;",
            "uniform vec2      resolution;",
            "uniform vec2      mouse;",

            "// https://www.shadertoy.com/view/MdXSzS",

            "void main()",
            "{",
            "vec2 uv = (gl_FragCoord.xy/resolution.xy)-.5;",

            "float time = time * .1 + ((.25+.05*sin(time*.1))/(length(uv.xy)+.07))* 2.2;",
            "float si = sin(time);",
            "float co = cos(time);",
            "mat2 ma = mat2(co, si, -si, co);",

            "float c = 0.0;",
            "float v1 = 0.0;",
            "float v2 = 0.0;",

            "for (int i = 0; i < 100; i++)",
            "{",
            "float s = float(i) * .035;",
            "vec3 p = s * vec3(uv, 0.0);",
            "p.xy *= ma;",
            "p += vec3(.22,.3, s-1.5-sin(time*.13)*.1);",
            "for (int i = 0; i < 8; i++)",
            "{",
            "p = abs(p) / dot(p,p) - 0.659;",
            "}",
            "v1 += dot(p,p)*.0015 * (1.8+sin(length(uv.xy*13.0)+.5-time*.2));",
            "v2 += dot(p,p)*.0015 * (1.5+sin(length(uv.xy*13.5)+2.2-time*.3));",
            "c = length(p.xy*.5) * .35;",
            "}",

            "float len = length(uv);",
            "v1 *= smoothstep(.7, .0, len);",
            "v2 *= smoothstep(.6, .0, len);",

            "float re = clamp(c, 0.0, 1.0);",
            "float gr = clamp((v1+c)*.25, 0.0, 1.0);",
            "float bl = clamp(v2, 0.0, 1.0);",
            "vec3 col = vec3(re, gr, bl) + smoothstep(0.15, .0, len) * .9;",

            "gl_FragColor=vec4(col, 1.0);",
            "}"
        ];*/
        var fragmentSrc = [
            "precision mediump float;",
            "uniform vec2      resolution;",
            "uniform float     time;",

            "void main( void )",
            "{",
            "vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;",

            "vec3 c = vec3( 0.0 );",

            "float amplitude = 0.50;",
            "float glowT = sin(time) * 0.5 + 0.5;",
            "float glowFactor = mix( 0.05, 0.15, glowT );",

            "c += vec3(0.02, 0.03, 0.13) * ( glowFactor * abs( 1.0 / sin(p.x + sin( p.y + time ) * amplitude ) ));",
            "c += vec3(0.02, 0.10, 0.03) * ( glowFactor * abs( 1.0 / sin(p.x + cos( p.y + time+1.00 ) * amplitude+0.1 ) ));",
            "c += vec3(0.15, 0.05, 0.20) * ( glowFactor * abs( 1.0 / sin(p.y + sin( p.x + time+1.30 ) * amplitude+0.15 ) ));",
            "c += vec3(0.20, 0.05, 0.05) * ( glowFactor * abs( 1.0 / sin(p.y + cos( p.x + time+3.00 ) * amplitude+0.3 ) ));",
            "c += vec3(0.17, 0.17, 0.05) * ( glowFactor * abs( 1.0 / sin(p.y + cos( p.x + time+5.00 ) * amplitude+0.2 ) ));",

            "gl_FragColor = vec4( c, 1.0 );",
            "}"
        ];
        this.filter = new Phaser.Filter(this.game, null, fragmentSrc);
        console.log(this.filter);

        var width = 1920;
        var height = 1080;
        console.log(width+ ' ' + height);

        this.filter.setResolution(width,height);

        var sprite = this.game.add.sprite(0,0);
        sprite.width = width;
        sprite.height = height;
        sprite.opacity = 0.5;

        // sprite.scale.setTo(1,1);
        sprite.filters = [ this.filter ];
        console.log(sprite);
    },
    ppp:function (game,pointer) {
      console.log('over');
        this.goToNextState();
    }
    ,
    conver:function(left,right,middle){
      if(!left&&!right&&!middle){
          return 0;
      }
        if(left&&!right&&!middle){
            return 1;
        }
        if(!left&&right&&!middle){
            return 2;
        }

        if(left&&right&&!middle){
            return 3;
        }
        return -1;
    },
    p:function (pointer) {

         console.log(pointer);
         console.log(pointer.leftButton.isDown);

         console.log(pointer.rightButton.isDown);
         console.log(pointer.middleButton.isDown);
        var id = this.conver(pointer.leftButton.isDown,pointer.rightButton.isDown,pointer.middleButton.isDown);
        console.log(id);



        // console.log(pointer);

    },
/*=======
		this.logo = this.game.add.sprite(560, 320, 'logo');
		this.startUp = this.game.add.sprite(616,250,'startUp');
		this.startDown = this.game.add.sprite(616,740,'startDown');
    this.fastSound.playMusic('title');
		this.game.input.onTap.add(this.goToNextState, this);
		this.game.time.events.loop(Phaser.Timer.HALF, this.blinkSprite, this);
	},*/
	blinkSprite: function(){
		this.startUp.visible = !this.startUp.visible;
		this.startDown.visible = !this.startDown.visible;
	},
/*>>>>>>> e6744151ee900c7ddeffd4db3274341cd52bba8a*/
  update: function(){
      this.filter.update(this.game.input.mousePointer);

      /*  this.background.tilePosition.x += 0.1;
        this.mediumLayer.tilePosition.x += 0.3;
        this.frontLayer.tilePosition.x += 0.5;*/
/*<<<<<<< HEAD
      if (this.room.input.pointerOver())
      {
          this.room.alpha = 1;
      }
      else
      {
          this.room.alpha = 0.5;
      }
  }
=======*/
  },
	goToNextState: function(){
		this.game.state.start('ColorIOTable');
	}
/*
>>>>>>> e6744151ee900c7ddeffd4db3274341cd52bba8a*/
};
