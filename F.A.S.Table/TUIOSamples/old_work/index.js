/**
 * @author Christian Brel <ch.brel@gmail.com>
 * @author Vincent Forquet
 * @author Nicolas Forget
 */

// Import JQuery
import $ from 'jquery/dist/jquery.min';

// Import TUIOManager
import TUIOManager from 'tuiomanager/core/TUIOManager';
import Vaisseaux from './vaisseaux';

// import buildMenu from './menu';

// import ps from 'https://cdn.rawgit.com/admsev/jquery-play-sound/master/jquery.playSound.js';

import io from 'socket.io-client';

/** TUIOManager starter **/
const tuioManager = new TUIOManager();
tuioManager.start();
const players_color = ['blue','red'];

/** App Code **/
function sendColor(){
  var socket = io.connect('http://192.168.1.50:8080'); // TODO: changer l'adresse IP
  socket.emit('FAST_TABLE_CONNECT', {});

  for (var i=0;i<4;i++){
    var jsonObject = {
      ATOM_PLAYER_ID: i,
      ATOM_PHONE_ID: i
    };
    socket.emit('FAST_PHONE_CONNECT', jsonObject);
  }

  socket.on('FAST_PHONE_CONNECT', function(data){
    // Change colors of the colored div
    document.getElementById( 'color_div'+data.ATOM_PLAYER_ID ).style.backgroundColor = data.COLOR.color;
    players_color[data.ATOM_PLAYER_ID] = data.COLOR.color;
  });
}


function initSocketIO(){
  var sounds = ["http://noproblo.dayjo.org/ZeldaSounds/OOT/OOT_Navi_Hello1.wav","http://noproblo.dayjo.org/ZeldaSounds/OOT/OOT_Navi_Hey1.wav","http://noproblo.dayjo.org/ZeldaSounds/OOT/OOT_Navi_Listen1.wav","http://noproblo.dayjo.org/ZeldaSounds/OOT/OOT_Navi_WatchOut1.wav"];
  var socket = io.connect('http://192.168.1.50:8080');//('http://localhost:8080')('http://192.168.1.50:8080');

  var pseudo = 'table';
  var port = 0;

  function addMessageLocal(message){
    $('#myTable > tbody:last-child').prepend('<tr><td style="color:blue">'+pseudo+': </td><td>'+message+'</td></tr>');
  }
  function addMessage(message){
    $('#myTable > tbody:last-child').prepend('<tr><td>'+message.pseudo+': </td><td>'+message.message+'</td></tr>');
    var position = Math.floor((Math.random() * sounds.length));;

    // ps.playSound(sounds[position]);
  }
  function addPseudo(pseudo){
    $('#myTable > tbody:last-child').prepend('<tr><td style="color:green"> New client: </td><td>'+pseudo+'</td></tr>');
  }
  function delPseudo(pseudo){
    $('#myTable > tbody:last-child').prepend('<tr><td style="color:red"> Client quit: </td><td>'+pseudo+'</td></tr>');
  }

  socket.emit('login', pseudo);
  socket.on('message', function(message) {
    console.log('message',message);
    //alert('Le serveur a un message pour vous : ' + message);
  })
  socket.on('portFast', function(message) {
    port = message;
    console.log('portFast'+message);
  })
  socket.on('message', function(message) {
    addMessage(message);
    console.log('receving message'+message);
  })
  socket.on('clientConnect', function(message) {
    console.log('clientConnect'+message);
    addPseudo(message);
  })
  socket.on('clientDisconnect', function(message) {
    console.log('clientConnect'+message);
    delPseudo(message);
  })

  socket.on('connectTo', function(message) {
    console.log('connectTo'+message);
    addPseudo(message);
    $('#myTable > tbody:last-child').prepend('<tr><td>'+message +' connected !</td></tr>');
  })

  $('#formulaire_chat').submit(function () {
    var message = $('#message').val();
    socket.emit('message', message); // Transmet le message aux autres
    addMessageLocal(message);

    $('#message').val('').focus(); // Vide la zone de Chat et remet le focus dessus
    return false; // Permet de bloquer l'envoi "classique" du formulaire
  });
}


const buildApp = () => {
  $('#app').append('<div id="example-container"> </div>');
  // buildMenu();
  initSocketIO();
  sendColor();
  Vaisseaux();
};

$(window).ready(() => {
  buildApp();
});
