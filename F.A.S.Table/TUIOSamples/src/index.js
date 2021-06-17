/**
 * @author Christian Brel <ch.brel@gmail.com>
 * @author Vincent Forquet
 * @author Nicolas Forget
 */

// Import JQuery
import $ from 'jquery/dist/jquery.min';

// Import TUIOManager
import TUIOManager from 'tuiomanager/core/TUIOManager';
import RoomWidget from './ImageWidget/roomWidget';

/** TUIOManager starter **/
const tuioManager = new TUIOManager();

/** App Code **/

const buildApp = () => {

};

$(window).ready(() => {
  tuioManager.start();
  var shipwidget = new RoomWidget(0, 0, 1920, 1080 ,'',window.gameO);
  /*window.gameF(shipwidget);*/

  tuioManager.addWidget(shipwidget);

  console.log(window.gameO);
  buildApp();
});
