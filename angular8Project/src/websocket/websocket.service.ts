import { Injectable, OnInit } from '@angular/core';

@Injectable({
providedIn: 'root'
})
export class WebsocketService{

constructor() { }
  defineWS = function (){
    let ws = null;
    ws = new WebSocket("ws://localhost:5001/");
    ws.id=0;
    //Sends a message to q via the websockets and logs the function and arguments
    ws.q = function (id, func, obj, resolve, reject){
      console.log(id, func, obj);
      let that = this;
      //if the connection has been lost and regained, redefine 'that'
      if(that.readyState===3){that = that.ws};
      that.postQ[id] = {resolve,reject};
      return that.send(JSON.stringify({id, func,obj}));
    };
    //Creates a promise, which will be resolved after data is returned from q, and trigger any corresponding .then functions.
    ws.qPromise = function(func, obj){
      this.id+=1;
      //ES6 arrow syntax is used so that the promise knows what 'this' is
      return new Promise((resolve, reject) => {
          this.q(this.id, func, obj, resolve, reject);
      })
    };
    ws.onclose=function(e){
      console.log('Websocket closed, will reconnect');
      setTimeout(function() {
        //ideally would define this = {...this, ...this.defineWS()}, but this isn't allowed
        this.ws = this.defineWS();
      }.bind(this), 1000);
    };
    ws.onmessage=function(e){
     let tmp = JSON.parse(e.data);
       let id = tmp[0];
       let fName = tmp[1];
       let fArgs = tmp[2];
       console.log("postQ",fName,fArgs);
       let f = "resolve";
       if(fArgs!==null){
         if(fArgs[0]==="'"){
           f = "reject";
         }
       };
       this.postQ[id][f](fArgs);
    };
    ws.onerror = function(err) {
      console.error('Closing socket after error: '+ err.message);
      this.close();
    };
    ws.onopen=function(e){
      console.log('websocket opened');
    };
    ws.postQ={};
    return ws;
  };
}