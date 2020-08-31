import { Component, OnInit} from '@angular/core';
import { WebsocketService } from '../websocket/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WebsocketService]
})
export class AppComponent {
  //globals
  tabNames : string[] = ["Calendar","OtherTab"];
  tab : number = 0;
  isNight : boolean = false;
  loading : boolean = true;
  id : number = 0;

  //funcs
  defineWS : any = function(){};
  constructor(private ws: WebsocketService){ }

  updateCSS : any = function(){
    let newClass : string = this.isNight ? 'nightMode' : 'dayMode';
    let oldClass : string = !this.isNight ? 'nightMode' : 'dayMode';
    let el = document.getElementsByClassName(oldClass)[0];
    el.classList.add(newClass)
    el.classList.remove(oldClass)
  };

  onOutletLoaded(component) {
    console.log('Passing websocket to child');
    component.ws = this.ws;
    if(component.loading===undefined){
      this.loading=false;
    }else{
      //The loading icon displays too briefly when changing tabs for this to be useful
      this.loading=true;
      console.log("Subscribing to child's loading boolean");
      component.loading.subscribe((bool) => {
        //Hide loading icon
        this.loading=bool;
      })
    }
  }

  ngOnInit() {
    console.log('Initialising app');
    //need to overwrite ws, and keep defineWS within it, to ensure ws.onclose auto-reconnect works
    this.defineWS = this.ws.defineWS;
    this.ws = this.defineWS();
    this.ws.defineWS = this.defineWS;
  }

}
