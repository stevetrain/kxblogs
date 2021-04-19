<template>
  <div v-bind:class="isNight ? 'nightMode' : 'dayMode'">
    <div style="display:flex">
      <span style="flex:99">
        <TabMenu :model="navbar"/>
      </span>
      <span class="toggleSpan" style="flex:1">
        <Slider v-on:click="updateCSS()" v-model="isNight"/>
      </span>
    </div>
    <router-view :calendar="calendar" :q="q" :qPromise="qPromise" :ws="ws" :index="index" :startDate="startDate" :monthNames="monthNames" :scrollTimer="scrollTimer"/>
  </div>
</template>

<script>
//TODO
//import defineWS from './src/components/Websocket.vue';
import TabMenu from 'primevue/tabmenu';
import Slider from '../src/components/Slider.vue';

export default {
  name: 'vueProject',
  components:[TabMenu, Slider],
  data: function() {
    return {
      isNight: false,
      navbar:[
        {label: 'Calendar', to: '/'},
        {label: 'OtherTab', to: '/otherTab'}
      ],
      ws: null,
      id: 0,
      calendar: [{}],
      startDate: new Date("08/03/2015"),
      index: function(){
        let today = new Date();
        let startDate = new Date("08/03/2015");
        return Math.round((today.getTime()-startDate.getTime())/(7*24*60*60*1000))-2
      }(),
      scrollTimer: 0,
      monthNames: ["January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ]
    }
  },
  methods: {
    updateCSS: function(){
      let bg = this.isNight ? '#121212f5' : 'white';
      document.body.style.backgroundColor = bg;
    },
    q: function (id, func, obj, resolve, reject){
      console.log(id, func, obj);
      this.ws.postQ[id] = {resolve, reject};
      return this.ws.send(JSON.stringify({id,func,obj}));
    },
    qPromise: function (func, q, obj){
      this.id+=1;
      var id = this.id;
      return new Promise(function(resolve,reject){
        q(id, func, obj, resolve, reject);
      })
    },
    defineWS: function(){
      this.ws = new WebSocket("ws://localhost:5001/");
      this.ws.postQ = {};
      this.ws.onopen=function(){
        console.log('websocket opened');
      };

      this.ws.onclose=function(e){
        console.log(e);
        console.log('Websocket closed, will reconnect');
        //TODO rethink reconnect logic
        //setTimeout(function() {
          //ideally would define this = {...this, ...this.defineWS()}, but this isn't allowed
          //this.ws = this.defineWS();
        //}.bind(this), 1000);
        //    this.openWS();
      };

      this.ws.onmessage=function(e){
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
         this.postQ[id][f](fArgs);
      };

      this.ws.onerror = function(err) {
        console.error('Closing socket after error: '+ err.message);
        this.ws.onclose();
      };
    },
    test: function(e){
      console.log(e);
      this.calendar=e;
    },
    init: function(){
      if(this.ws.readyState===0){setTimeout(this.init,50); return}
      this.getHeight();
    },
	getHeight: function(obj){
      return this.qPromise(".cal.getHeight",this.q,obj).then(this.postGetHeight)
	},
	postGetHeight: function(data){
      this.height=data;
      this.getCalendar(this.index);
	},
	getCalendar: function(i){
      return this.qPromise(".cal.getCalendar",this.q,i).then(this.postGetCalendar)
    },
    postGetCalendar: function(table){
      this.monthMessage="";
      this.calendar=table;
      this.scrollTimer=0;
    },
    onWheel: function(event){
      clearTimeout(this.scrollTimer);
      let polarity=1;
      if(event.deltaY<0){polarity=-1}
      let edge = false;
      if(this.index<=0 && polarity===-1){edge = true}
      if(this.index>=this.height && polarity===1){edge = true}
      if(!edge){this.index+=polarity}
      this.scrollTimer=setTimeout(this.getCalendar,50, this.index);
    },
    onKeyDown: function(event){
      //Don't refresh the calender if the user is currently editing a cell
      if(event.target.tagName==='TD'){return}
      let code;
      if (!event){
        code = window.event.keyCode;
      }else if (event.charCode){
        code = event.charCode;
      }else{
        code = event.keyCode;
      }
      switch(code) {
        case 37:
          //left-arrow
          if(this.index<=8){this.index = 0}else{this.index -= 8}
          break;
        case 38:
          //up-arrow
          if(this.index!==0){this.index -= 1}
          break;
        case 39:
          //right-arrow
          if(this.index>(this.height-8)){this.index = this.height}else{this.index += 8}
          break;
        case 40:
          //down-arrow
          if(this.index<this.height){this.index += 1}
          break;
        default:
          //do nothing for other keys
          break;
      }
      this.getCalendar(this.index);
    }
  },
  created: function(){
    document.addEventListener("keydown", this.onKeyDown, false);
    document.addEventListener("wheel", this.onWheel, false);
    this.defineWS();
    this.init();
  },
  unmounted: function(){
    document.removeEventListener("keydown", this.onKeyDown, false);
    document.removeEventListener("wheel", this.onWheel, false);
  }
}
</script>

<style scoped>
.dayMode {background-color: white}

.nightMode {
    color: #fff;
}
</style>

<style>
body {font-family: Arial}
.toggleSpan {
    border: 1px solid #dee2e6;
    border-width: 0 0 2px 0;
}
.dayMode .toggleSpan {background-color: #0070cd}
.nightMode .toggleSpan {background-color: #121212f5}
.dayMode .p-tabmenu .p-tabmenu-nav {background: #0070cd!important}
.nightMode .p-tabmenu .p-tabmenu-nav {background: #121212f5!important}
.dayMode .p-tabmenu .p-tabmenu-nav .p-menuitem-link {background: #0070cd!important}
.nightMode .p-tabmenu .p-tabmenu-nav .p-menuitem-link {background: #121212f5!important}
.p-tabmenu .p-tabmenu-nav .p-menuitem-link {color: #dccece!important}
.p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-highlight .p-menuitem-link {color: white!important}
.p-tabmenu .p-tabmenu-nav .p-tabmenuitem .p-menuitem-link:not(.p-disabled):focus {box-shadow: none!important}
</style>