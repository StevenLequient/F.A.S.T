
FastGame.ColorConnector = function (game) { this.game=game};
FastGame.ColorConnector.prototype = {
    init: function(eventAdapter, parameters){
      this.eventAdapter = eventAdapter;
    },
    preload: function () {
        this.video = undefined;
        this.sequence = [];
        //this.invalidIP = [];

        this.lastFound = 0;
        this.group = undefined;
        this.game.load.image('loading', './img/loading.png');
    },
    create: function () {
        console.log("create fast color");

        var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

        this.game.input.onUp.add(this.startCamera, this);

        this.game.add.sprite(0,0,'loading');
        this.ipText = this.game.add.text(0, 0, "No data",style);

    },
    startCamera: function () {
        let options = {
            x: 0,
            y: 0,
            width: 200,
            height: 200,
            camera: CameraPreview.CAMERA_DIRECTION.BACK,
            toBack: false,
            tapPhoto: false,
            tapFocus: false,
            previewDrag: true
        };

        CameraPreview.startCamera(options, this.camAllowed, this.errorLog);

        this.game.input.onUp.removeAll();

        CameraPreview.show();
        this.takeSnapshot();
        this.game.input.onDown.add(this.analyseSuequence2, this);

        console.log('start');
        this.pictureLoop = this.game.time.events.loop(500, this.takeSnapshot, this);

    },
    successsss: function (ok) {
        console.log("success "+ok);
    },
    errorLog: function (err) {
        console.log(err);
    },
    update: function () {

    },
    camAllowed: function (cam) {
        console.log('Camera was allowed'+cam);

        //this.group.createMultiple(16, 'diamonds', [0, 1, 2, 3, 4], true);
    },

camBlocked: function (video, error) {

        console.log('Camera was blocked', video, error);

    },
    extractRGB: function (intvaluee) {
        var data = [];
        //r
        data[3] = (intvaluee & 0xFF000000) >> 24;
        //g
        data[0] = (intvaluee & 0x00FF0000) >> 16;
        //b
        data[1] = (intvaluee & 0x0000FF00) >> 8;
        //a
        data[2] = (intvaluee & 0xFF);
        return { data: data }
},
    takeSnapshot: function () {


    CameraPreview.takePicture({ width: 10, height: 10, quality: 100 }, (base64PictureData) => {

        var intC = parseInt(base64PictureData);

        var pixel = this.extractRGB(parseInt(base64PictureData))

        var colorServ = {
            red: pixel.data[0],
            green: pixel.data[1],
            blue: pixel.data[2]
        };

        var convert = function decimalToHexString(number)
        {
            if (number < 0)
            {
                number = 0xFFFFFFFF + number + 1;
            }

          return number.toString(16).toUpperCase();
        };

        var color = '#'+convert(colorServ.red)+convert(colorServ.green)+convert(colorServ.blue);
        this.game.stage.backgroundColor = color;
        console.log(color);
        var byte = this.extractdata(colorServ);
        console.log('byte decoded' + byte);
        colorServ.byteO = byte;


        });

},

// color to byte (0..7)
    extractdata: function (color) {
        // use only 1 strongest bits for each component for now ...
        var byte = 255;

        var r = color.red >> 7;
        var g = color.green >> 7 << 1;
        var b = color.blue >> 7 << 2;
        byte = 255 & (r | g | b);

        //console.log('adding '+byte); // 1

        this.sequence.push(byte);
        return byte;
},
    checksum: function (byteB){
    var ones = 0;
    while (byteB != 0) {
        if (byteB % 2)
            ones++;
        byteB = byteB >> 1;

    }
    return ones % 2;
}, analyseSuequence2: function () {
       /* if(this.sequence.length===0){
            console.log('cannot send connect, no color');
            return;

        }*/
        this.tryConnect('');

    },

    analyseSuequence: function () {


        if (this.sequence.length < 16) {
            console.log('sequence is too short to contain a message');
        }

        var fullByte = 8;
        var bytes = [];

        // 3 images 1 octet 12 images 36 bits + = 4 bits inutiles utilisés pour checksum
        // séquence de début de message: 0000 (à revoir car il peut y avoir des collision (ou bien utiliser les autres bits));
        var found = this.sequence.indexOf(0,this.lastFound);
        // 0 not found
        if (found == -1) {
            console.log('start sequence not found');
            return;
        }

        this.lastFound = found;
        //if less colors than a message: no need to check for array end later
        if (found + 16 > this.sequence.length) {
            console.log('not enouth colors to decode ' + found);
            console.log(this.sequence.length);
            return;
        }

        this.lastFound += 1;
        for (var i = 0; i < 4; i++) {
            if (this.sequence[found + i]!=0) {
                console.log('start sequence not found');
                return;
            }
        }


        var pos = 0;
        // 00011100 1 11100011 1 00011100 0 11100011 1
        var i = found+4; // 4 color of header
        for (; i <found + 16; i += 3) {

            //extract 3 bits
            var b1 = this.sequence[i];
            var b2 = this.sequence[i+1];
            var b3 = this.sequence[i + 2];

            bytes[pos] = 0;
            // b11                  b22         b3        3  ==>b11b22b3 3(last bit not used)
            bytes[pos] = (b1 << 5) | (b2 << 2) | (b3 >> 1);
            var boolCkec = this.checksum(bytes[pos]);

            // implement checksum
            if (b3%2!= boolCkec) {
                console.log('checksum not good ' + pos + '   '+i);
                console.log(bytes[pos]);


            }
            pos++;
        }
        console.log('################################" Got: ' + bytes[0] + '.' + bytes[1] + '.' + bytes[2] + '.' + bytes[3]);

        var chr = String.fromCharCode(65 + bytes[0]);
        var chr1 = String.fromCharCode(65 + bytes[1]);
        var chr2 = String.fromCharCode(65 + bytes[2]);
        var chr3 = String.fromCharCode(65 + bytes[3]);
        var ip = bytes[0] + '.' + bytes[1] + '.' + bytes[2] + '.' + bytes[3];
        console.log('################################" Got CHAR: ' + chr + '.' + chr1 + '.' + chr2 + '.' + chr3);
    },
    tryConnect:function(ipp) {

        //TODO : remove that
        ipp = FastGame.hardIP;
        this.ipText.setText(ipp);

        /*if (this.invalidIP.includes(ipp)) {
            console.log("already tried this" + ipp);
            return;
        }*/
        var signalResult = FastGame.fastSocket.init(ipp);
        FastGame.stateManager.socket = FastGame.fastSocket.serverSocket;
        this.eventAdapter.setSocket(FastGame.fastSocket.serverSocket);
        signalResult.add(function(isGood){
          if(isGood){
            //FastGame.fastSocket.serverSocket.emit('FAST_PHONE_CONNECT',this.sequence[this.sequence.length-1]);
            this.eventAdapter.SEND[PROTOCOL.FAST_PHONE_CONNECT]({ATOM_PHONE_ID : this.sequence[this.sequence.length-1]});
            this.eventAdapter.addCallback(PROTOCOL.FAST_PHONE_OK, this.startGame, this);
            //FastGame.fastSocket.serverSocket.on('FAST_PHONE_OK', this.gameStart, this);
          }
          else{
            //this.invalidIP.add(ipp);
          }
        }, this);
        /*this.sockTest = io('http://' + ipp + ':8080', {
            reconnection: false
        });

        this.sockTest.on('connected', function () {
            this.sockTest.emit("message", "hey");
            this.game.ip = ipp;

            this.ipText.setText("connected");
            console.log("okkkk connect");

            this.game.time.events.remove(this.pictureLoop);
            FastGame.stateManager.goToState('Boot');
        });

        this.sockTest.on('disconnect', function () {
            this.invalidIP.add(ipp);
        });

        this.sockTest.on('connect_failed', function () {
            this.invalidIP.add(ipp);
        });

        this.sockTest.on('error', function () {
            this.invalidIP.add(ipp);
        });*/
    },
    startGame : function(data){
      if(!data.ID){
        data = {};
        data.ID = 46;
      };
      FastGame.ID = data.id;
      CameraPreview.stopCamera();
      this.game.ip = this.ipText.text;
      this.game.time.events.remove(this.pictureLoop);
      FastGame.playerColor = FastGame.getColor(data.id);
      FastGame.eventRegistry.init();
      FastGame.broadcastChannel.init();
      this.eventAdapter.destroy();
      FastGame.stateManager.goToState(STATELIST.FAST_STATUS_SCREEN, {});
    }

};
