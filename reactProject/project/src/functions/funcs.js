let d = {};
//On tab-change the functions aren't redefined properly
d.q = function (id, func, obj, resolve, reject){
    console.log(id, func, obj);
    let ws = this.state.ws;
    ws.postQ[id] = {resolve, reject};
    this.setState({ws});
    return ws.send(JSON.stringify({id,func,obj}));
};

//Creates a promise, which will be resolved after data is returned from q, and trigger any corresponding .then functions if successful, or .catch if unsuccessful
d.qPromise = function(func, q, obj){
    let id = this.state.id;
    id+=1;
    this.setState({id});
    return new Promise(function(resolve,reject){
        q(id, func, obj, resolve, reject);
    })
};

d.formatDate = function(i,d){
    if(d===undefined){
      d = new Date();
    }else{
      d = new Date(d);
    };
    d.setDate(d.getDate()+(i*7));
    var month = d.getMonth();
    var year = d.getFullYear();
    const monthNames =["January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
    return monthNames[month] + ' ' + year;
};

d.wheel = function(event) {
  let monthMessage = this.formatDate(this.state.index,"08/03/2015");
  this.setState({monthMessage});
  //cal.date = website.formatDate(cal.index,"08/03/2015");
  clearTimeout(this.state.scrollTimer);
  let polarity=1;
  if(event.deltaY<0){polarity=-1};
  let edge = false;
  if(this.state.index<=0 && polarity===-1){edge = true};
  if(this.state.index>=this.state.height && polarity===1){edge = true};
  if(!edge){this.setState({index:this.state.index+polarity})};
  this.setState({scrollTimer: setTimeout(this.getCalendar,50)});
}

d.keyDown = function(event){
    if(event.target.tagName==='TD'){
      return;
    }
    let code;
    if (!event){
        code = window.event.keyCode;
    }else if (event.charCode){
        code = event.charCode;
    }else{
        code = event.keyCode;
    };
    let index;
    switch(code) {
        case 37:
            if(this.state.index<=8){
              index = 0
            }else{
              index = this.state.index-8;
            }
            this.setState({index});
            break;
        case 38:
            if(this.state.index!==0){
                index = this.state.index-1;
                this.setState({index});
            };
            break;
        case 39:
            if(this.state.index>(this.state.height-8)){
              index = this.state.height
            }else{
              index = this.state.index+8;
            };
            this.setState({index});
            break;
        case 40:
            if(this.state.index<this.state.height){
                index = this.state.index+1;
                this.setState({index});
            };
            break;
        default:
            break;
    }
    this.getCalendar();
};

d.error = function(e){
alert("Failed due to: "+e)
}

d.init = function(){
this.qPromise(".cal.getHeight", this.q).then(this.postGetHeight).catch(function(e){alert(".cal.getHeight failed due to: "+e)}).then(this.getCalendar);
}

d.getCalendar = function(){
(this.qPromise(".cal.getCalendar",this.q,this.state.index)).then(this.postGetCalendar).catch(this.error)
}

d.postGetCalendar = function(table){
let monthMessage="";
this.setState({table,monthMessage});
}

d.postGetHeight = function(height){
this.setState({height})
}

//cal.index gives the index of the top row.
//$parent.$index gives the index of the selected row from the top row
d.editRow = function(e){
    //i, kol, text
    if(this.state.edit!==undefined){
      let table = this.state.table;
      let input = this.state.edit;
      //Persist the text change on the front end, as well as the backend
      table[input[0]][input[1]]=input[2];
      this.setState({table});
      input[0]+=this.state.index;
      this.qPromise(".cal.editRow",this.q,input).then(this.postEditRow).catch(this.error)
    };
};

d.postEditRow = function(data){
  this.state.edit=undefined;
}

d.cellChange = function(e, i, kol){
  this.state.edit=[i,kol,e.target.value];
}

d.updateCSS = function(){
  let isNight = !this.state.isNight;
  this.setState({isNight});
  let bg = isNight ? '#121212f5' : 'white';
  document.body.style.backgroundColor = bg;
}

d.tabChange = function(){
  let currentTab=window.location.pathname;
  //Don't display the scrollbar for the calendar
  let scroll = (currentTab==='/') ? 'hidden' : 'initial';
  document.body.style.overflow = scroll;
  this.setState({currentTab})
}

export default d