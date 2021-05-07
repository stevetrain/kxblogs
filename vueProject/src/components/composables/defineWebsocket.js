import { ref, onMounted } from 'vue'

export default function defineWS() {
  console.log('Defining Websocket');
  const ws = ref([]);
  var id;
  const activeConnection = ref([]);
  const defineWS = function(){
    ws.value = new WebSocket("ws://localhost:5001/");
    id = 0;
    activeConnection.value = false;

    ws.value.postQ = {};

    ws.value.onopen = function(){
      console.log('Websocket opened');
      activeConnection.value = true;
    };

    ws.value.onclose = function(){
      console.log('Websocket closed, will reconnect');
      if(activeConnection.value){
        activeConnection.value = false;
        const ws = ref([]);
        ws.value = defineWS();
      }
    };

    ws.value.onmessage = function(e){
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
       }
       ws.value.postQ[id][f](fArgs);
    };

    ws.value.onerror = function(err) {
      console.error('Closing socket after error: '+ err.message);
      ws.value.onclose();
    };
  }
  onMounted(defineWS)

  var q = function (id, func, obj, resolve, reject){
    console.log(id, func, obj);
    ws.value.postQ[id] = {resolve, reject};
    return ws.value.send(JSON.stringify({id,func,obj}));
  }

  var qPromise = function (func, obj){
    id++;
    return new Promise(function(resolve,reject){
      q(id, func, obj, resolve, reject);
    })
  };

  return {
    ws,
    qPromise,
    activeConnection
  }
}