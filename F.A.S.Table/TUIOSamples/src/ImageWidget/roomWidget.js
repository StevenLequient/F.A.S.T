import $ from 'jquery/dist/jquery.min';

import TUIOWidget from 'tuiomanager/core/TUIOWidget';

const players_color = ['blue','red'];

class RoomWidget extends TUIOWidget {

  constructor(x, y, width, height, roomType,gamep) {
    super(x, y, width, height);
    this.game = gamep;
    this._lastTouchesValues = {};
    this._lastTagsValues = {};

    this.atoms = [];

    console.log('ROOM WIDGET CREATED');

  }

  createDown(id,x,y,ang){
      var event = new PointerEvent('pointerdown', {
          view: window,
          bubbles: true,
          cancelable: true,
          pointerId:id,
          clientX: x,
          clientY: y,
          tiltY:id,
          tiltX:ang*1000

      });
      var yz = document.getElementsByTagName("canvas")[0];
      yz.dispatchEvent(event);
  }
  createmove(id,x,y,ang,tuioTag2){
      var event = new PointerEvent('pointermove', {
          view: window,
          bubbles: true,
          cancelable: true,
          pointerId:id,
          clientX: x,
          clientY: y,
          angle:ang,
          tiltX:ang*1000,
          tiltY:id,
          tuioTag:tuioTag2,
          id:tuioTag2.id
      });
      var yz = document.getElementsByTagName("canvas")[0];
      //console.log('move'+tuioTag2.id);
      yz.dispatchEvent(event);
  }
  createUp(id){
      var event = new PointerEvent('pointerup', {
          view: window,
          bubbles: true,
          cancelable: true,
          pointerId:id,
          tiltY:id

      });

      var yz = document.getElementsByTagName("canvas")[0];
      yz.dispatchEvent(event);
  }
  onTagCreation(tuioTag) {
    super.onTagCreation(tuioTag);
    //var index = this.findFirstEmptyTagIndex();
    //console.log('index free:'+index);
    //this.atomsOS[index] = tuioTag.id;
      //
      console.log(this.atoms[tuioTag.id]);
      /*if(this.atoms[tuioTag.id]===1){
          this.createmove(tuioTag.id,tuioTag.x,tuioTag.y,tuioTag._angle,tuioTag);
            return;
      }*/
      this.atoms[tuioTag.id] = 1;
    console.log('creation', + tuioTag.x +' '+ tuioTag.y+' '+tuioTag.id);
    console.dir(tuioTag);
    console.dir(this.atoms);
    this.createDown(tuioTag.id,tuioTag.x,tuioTag.y);
  }

  onTagUpdate(tuioTag) {
      super.onTagUpdate(tuioTag);

      //console.log('update');


    var ang = tuioTag._angle;
    this.createmove(tuioTag.id,tuioTag.x,tuioTag.y,ang,tuioTag);
  }

  onTagDeletion(tuioTagId){
      super.onTagDeletion(tuioTagId);

      console.log('deletion' + tuioTagId);
      this.createUp(tuioTagId);

      // this._domElem.css('background-color', 'yellow');
  }
    onTouchCreation(tuioTouch){
        var event = new PointerEvent('pointerdown', {
            view: window,
            bubbles: true,
            cancelable: true,
            pointerId:tuioTouch.id,
            clientX: tuioTouch.x,
            clientY: tuioTouch.y

        });
        console.log('touch: '+tuioTouch.x + ' ' +tuioTouch.y);
        console.dir(event);
        // event.isTrusted = true;
        // console.log(event.identifier)
        var y = document.getElementsByTagName("canvas")[0];
        //y.dispatchEvent(event);

    }

      onTouchUpdate(tuioTouch) {
          //super.onTouchUpdate(tuioTouch);
        //console.log('update'+tuioTouch);


      /*    var event = new PointerEvent('pointermove', {
              view: window,
              bubbles: true,
              cancelable: true,
              pointerId:tuioTouch.id,
              clientX: tuioTouch.x,
              clientY: tuioTouch.y
          });
          console.log('touch: '+tuioTouch.x + ' ' +tuioTouch.y);
          console.dir(event);
          // event.isTrusted = true;
          // console.log(event.identifier)
          var y = document.getElementsByTagName("canvas")[0];
          //console.log(y);
          y.dispatchEvent(event);*/
      }
    onTouchDeletion(tuioTouch) {

        console.log(tuioTouch);

        var event = new PointerEvent('pointerup', {
            view: window,
            bubbles: true,
            cancelable: true,
            pointerId:tuioTouch
        });
        console.dir(event);
        // event.isTrusted = true;
        // console.log(event.identifier)
        var y = document.getElementsByTagName("canvas")[0];
        //console.log(y);
       // y.dispatchEvent(event);
    }

}

export default RoomWidget;
