var http = require('http');
var fs = require('fs');

// app.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/public/index.html');
});

server.listen(8080);

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.send('hello world');
});

app.use(express.static('public'));
// var server = http.createServer(function(req, res) {
    // fs.readFile('./index.html', 'utf-8', function(error, content) {
        // res.writeHead(200, {"Content-Type": "text/html"});
        // res.end(content);
    // });
// });

// FAST

var tableID = 0;
var tableSocket;

var players = [];
var playerIndex=0;
var playerIndexPhone=0;

var colors = [{color:"#f4f142",text:"jaune"},
{color:"#4286f4",text:"bleu"},
{color:"#edb11a",text:"orange"},
{color:"#8317c1",text:"violet"}];

// Chargement de socket.io
//var io = require('socket.io').listen(server);
// io.use(ios(session));
var p2p = require('socket.io-p2p-server').Server;
io.use(p2p);

var clients = [];
var portFast = 1000;
var rooms = [];

function getIp(socket){
	var address = socket.handshake.address;
	return address.address;
}

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');


	// Exemple Chat protocol
	socket.on('message', function (message) {
		var mess = {'pseudo':socket.pseudo,'message':message}
        console.log('brodcasting message'+socket.pseudo + ' : ' + message);
		if(message=="FAST")
		{
			console.log("sending fast");
			socket.broadcast.emit('FAST_PRIVATE_MINI_GAME_START',{});
		}
		socket.broadcast.emit('message', mess);
    });

	socket.on('login', function (pseudi){
		console.log('Login '+pseudi);
        socket.pseudo = pseudi;
		clients[pseudi] = socket;
		socket.emit('portFast',portFast++);
		socket.emit('loginCallback',portFast++);


		socket.broadcast.emit('clientConnect', pseudi);
		console.log('login of'+socket.pseudo);
    });

	socket.on('login', function (pseudi){
		console.log('Login '+pseudi);
        socket.pseudo = pseudi;
		clients[pseudi] = socket;
		socket.emit('portFast',portFast++);
		socket.emit('loginCallback',portFast++);


		socket.broadcast.emit('clientConnect', pseudi);
		console.log('login of'+socket.pseudo);
    });

	function disconnectClient(pseudo){
		socket.broadcast.emit('clientDisconnect', socket.pseudo);
		clients[socket.pseudo]=null;
        socket.pseudo = null;
	}

	socket.on('unlogin', function (message) {
		console.log('Unlogin '+ socket.pseudo + ' ;mess ' + message);
		disconnectClient(socket.pseudo);
    });

	function findPlayerWithID(id){
        var found = 0;
        console.log('findPlayerWithID');
        console.log(id);
        for(var i=0;i<players.length;i++){
            if(players[i].ATOM_PLAYER_ID===id){
                return  players[i];
            }
        }
	}

	//room exchange
    socket.on('ROOM',function (mess) {
        // find player

        var player = findPlayerWithID(mess.TAG_ID);
        if(player===undefined)
        {
            console.log('cannot start game, player not found');
            console.dir(mess);
            console.dir(players);
            return;
        }
        if(mess.FIRE){
            if(mess.players.length===4){
                console.log('starting fire');
                startFastFire();
            }
            else{
                console.log('not enought players');
                console.dir(mess);
            }
            // verify number required

            // start game
        }
        else if(mess.LIGHT){
            console.log('starting FAST_GAME_SWITCH');

            var al = {
                GAME:'FAST_GAME_SWITCH',
                ROOM:mess.ROOM
            };
            player.socket.emit('FAST_GAME_INIT',al);
            player.socket.emit('FAST_GAME_START',al);

        }
        else if(mess.SHIELD){
            console.log('starting FAST_GAME_METEOR');

            // start meteor game
            var al = {
                GAME:'FAST_GAME_METEOR',
                ROOM:mess.ROOM
            };
            player.socket.emit('FAST_GAME_INIT',al);
            player.socket.emit('FAST_GAME_START',al);
        }
        else if(mess.BALL){
            console.log('starting FAST_GAME_BALLISTIC');
            //start ballistic game
            var al = {
                GAME:'FAST_GAME_BALLISTIC',
                ROOM:mess.ROOM
            };
            player.socket.emit('FAST_GAME_INIT',al);
            player.socket.emit('FAST_GAME_START',al);
        }

        console.log('ROOOOOMMM PLayer not found :"(');
            console.log('room');
            console.dir(mess);
    });


    socket.on('FAST_PHONE_OK', function(data){
    	console.log('FPO');
        socket.broadcast.emit('FAST_PHONE_OK', data);
    });

    socket.on('FAST_EVENT_BROADCAST', function(data){
        socket.broadcast.emit('FAST_EVENT_BROADCAST', data);
    });

	socket.on('disconnect', function (message) {
		console.log('disconnect '+ socket.pseudo + ' ;mess ' +message);

		disconnectClient(socket.pseudo);
    });

	socket.on('peer-obj', function (message) {
		console.log('peer ' + message);
		disconnectClient(socket.pseudo);
    });

	socket.on('connectTo',function(pseudo){
		console.log(socket.pseudo + ' asked to connect to'  + pseudo);
		if(clients[pseudo]==null){
			console.log('cannot connect ' + socket.pseudo + ' to '+ pseudo);
			return;
		}
		var socket2 = clients[pseudo];
		var ip = getIp(socket2);
		var mess = {'ip':ip,'port':socket2.port}
		socket.emit('connectTo', mess);
	});
  //P2P Pas p2p
  socket.on('FAST_PRIVATE_SYNC', function(data){
    socket.broadcast.emit('FAST_PRIVATE_SYNC', data);
  });

	// FAST Protocol

	// TABLE_CONNECT
	socket.on('FAST_TABLE_CONNECT',function(none){
		console.log("TABLE_CONNECT");
		tableID = 0;
		tableSocket = socket;
		socket.emit('FAST_TABLE_CONNECT', tableID);
	});

    socket.on('FAST_GAME_END',function(none){

        tableSocket.emit(none.GAME,{GAME:none.GAME,ROOM:none.ROOM,FIRE:false});
    });

	// FAST_COLOR
	socket.on('FAST_COLOR',function(none){
		console.log("FAST_COLOR");
		socket.broadcast.emit('FAST_COLOR', none);

	});

    socket.on('FIRE_WEAPON',function(value){
        console.log("FIRE_WEAPON");
        socket.broadcast.emit('FIRE_WEAPON', value.PREC);

    });

	socket.on('FAST_PHONE_CONNECT',function(object){
		console.log('FAST_PHONE_CONNECT');
		console.log(object);

		if(tableSocket===socket){
			console.log("table add player");
			// from table
			// add player object
			// object.PLAYER_ID = playerIndex++;
			// object.COLOR = colors[object.PLAYER_ID];
			object.PHONE_CONNECTED = false;
			players.push(object);
			console.log(players.length);
            playerIndex++;
		}
		else{
			//createPlayer();
			var foundP = findPlayer(object.data.ATOM_PHONE_ID,socket);

			if(foundP === undefined){
				//createPlayer();
				//foundP = findPlayer(object.ATOM_PHONE_ID,socket);
				console.log('not found player with id'+object.data.ATOM_PHONE_ID);
				return;
			}


			console.log('Player was found and socket set');

			//all player connected
			if(playerIndexPhone===4){
                if(tableSocket!=null){

                    tableSocket.emit('FAST_PHONE_OK', {});
                    console.log(players.length);
                    for(var t=0;t<players.length;t++){
                        if(players[t].socket){
                            var datassss = {ID:players[t].ATOM_PLAYER_ID};
                            var dd = {data:datassss};
                            console.log('send');
                            console.log(dd);
                            console.log(players[t]);
                            players[t].socket.emit('FAST_PHONE_OK',dd);
                        }
                    }
                    //tableSocket.broadcast.emit('FAST_PHONE_OK', {});

                    //setTimeout(startDemoGames, 3000);

                }

			}
		}
	});
  //Mini Game and some stuff

	socket.on('FAST_EMIT',function (ok) {
        //tableSocket.emit(ok.key,ok.data);
        tableSocket.emit(ok.key,ok.data);
		console.dir(ok);

   })
});

function startFastFire(nbPlayer){
    //TODO ADD TEAMS
  var teams = [
    {FAST_GAME_FIRE_RED: getRandomInt(8,10)},
    {FAST_GAME_FIRE_GREEN: getRandomInt(8,10)},
    {FAST_GAME_FIRE_BLUE: getRandomInt(8,10)},
    {FAST_GAME_FIRE_PURPLE: getRandomInt(8,10)}
  ];

  var datas = [];

  for(i = 0; i < nbPlayer.length; i++){
    datas[i]= [
      teams.slice(0,nbPlayer.length-1)
    ]
  }

  //TODO : send to client
  for(j = 0; j < nbPlayer.length; j++){
      var al = {
          DATA:datas[j],
          GAME:'FAST_GAME_FIRE',
          isDemo: false,
		      ROOM:2
      };
    nbPlayer[j].emit('FAST_GAME_INIT', al);
  }
    for(j = 0; j < nbPlayer.length; j++){
        nbPlayer[j].emit('FAST_GAME_START');
    }
}

function startSwitch(playerSocket){
  playerSocket.emit('FAST_GAME_SWITCH');
}

function startMeteor(playerSocket){
  playerSocket.emit('FAST_GAME_METEOR');
}

function startMinigame(players){
  for(i = 0; i < players.length; i++){
    players[i].emit('FAST_PRIVATE_START');
  }
}

function findPlayer(id,socket){
	var found = 0;
    console.log('findPlayer id');
    console.log(players.length);
    for(var GG=0;GG<players.length;GG++){
        console.log('find id');

        console.log(players[GG]);
		if(!players[GG].PHONE_CONNECTED){
            console.log("Found player not connected");
            console.log(players[i]);

            if(players[GG].ATOM_PHONE_ID===id){
				console.log('match id');
                players[GG].PHONE_CONNECTED = true;
                players[GG].OK = true;
                players[GG].socket = socket;
                //socket.player = players[i];
                playerIndexPhone++;

                return  players[GG];

            } else
			{
				console.log('no match');
			}

		}
		else{
			found ++;
		}
	}
	if(found===3){
        for(var i=0;i<players.length;i++){
            if(!players[i].PHONE_CONNECTED){
                console.log("Found player not connected");
                //console.log(players[i]);


                    console.log('match id');
                    players[i].PHONE_CONNECTED = true;
                    players[i].OK = true;
                    players[i].socket = socket;
                    foundP = players[i];
                playerIndexPhone++;

                players[i].socket = socket;

                return  players[i];
            }
        }
	}
	console.log('not found');

}

function createPlayer(){
	var object = {
			ATOM_PHONE_ID: 20,
			ATOM_PLAYER_ID: playerIndex,
			PHONE_CONNECTED: false
	};
	object.PLAYER_ID = playerIndex++;
	object.COLOR = colors[object.PLAYER_ID%colors.length];
	console.log("created player");
	console.log(object);
	players.push(object);

}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log('Listening to 8080');
server.listen(8080);


// server for opencv
var net = require('net');
var server2 = net.createServer(function(socket) {
	console.log('someone connected');
    socket.on('data', function (data) {
    	console.log('data'+data);
    	console.dir(data);
    	var rData = data.toString();
        console.log('data'+rData);

        if(tableSocket){
            if(data<0){
                var game =  {ROOM:7,FIRE:true};

                tableSocket.emit('FAST_GAME_BALLISTIC',game);
                // show icon
                return;
            }
    	    console.log('shot');
            var gameSS =  {PREC:rData};
            console.log(gameSS);
            tableSocket.broadcast.emit('FAST_GAME_BALLISTIC_SHOT_FIRED', gameSS);
            tableSocket.broadcast.emit('FIRE_WEAPON', gameSS);

            var game =  {ROOM:7,FIRE:false};

            tableSocket.emit('FAST_GAME_BALLISTIC',game);

            tableSocket.emit('FIRE_WEAPON', gameSS);

            var game =  {ROOM:7,FIRE:false};
            tableSocket.emit('FAST_GAME_BALLISTIC',game);
        }

        // broadcast(socket.name + "> " + data, socket);
    });
    //socket.write('Echo server\r\n');
    //socket.pipe(socket);
});
console.log('waiting for connect');

//server2.listen(4001, '192.168.1.25');
