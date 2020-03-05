import React, { PureComponent as Component} from 'react';
import Tabs from './components/Tabs.js'
import dict from './functions/funcs.js'
import './App.css';
import './Slider.css';
import table2 from './functions/randomTable.js'

class App extends Component {
  constructor(props) {
    super(props);
    //Functions can't access 'this' unless they are bound
    this.binder = this.binder.bind(this);
    this.binder(dict);
    let tmp1 = new Date();
    let tmp2 = new Date("08/03/2015");
    let index=Math.round((tmp1.getTime()-tmp2.getTime())/(7*24*60*60*1000))-2;
    this.state={
      index, monthMessage:"", height:0, id:0, sort:0, isNight:false, activeConnection:false, table2
    };
    this.openWS();
  }

  componentWillUnmount(){
    this.ws.close();
  }

  openWS = function(){
    let ws = new WebSocket("ws://localhost:5001/");
    ws.postQ = {};
    ws.onmessage = this.onmessage.bind(this);
    ws.onopen = this.onopen.bind(this);
    ws.onclose = this.onclose.bind(this);
    this.state.ws=ws;
  }

  binder=function(dict){
      let funcs = Object.keys(dict)
      for(let i=0; i<funcs.length; i++){
        this[funcs[i]] = dict[funcs[i]].bind(this);
      }
  }

  //After the websocket is opened populate the home page
  onopen=function(e){
    this.setState({activeConnection:true})
  	this.init()
  };

//If the connection is lost, display a loading icon and try to reopen the websocket
  onclose=function(e){
    this.setState({activeConnection:false});
    this.openWS();
  };

  onmessage=function(e){
   let tmp = JSON.parse(e.data);
     let id = tmp[0];
     let fName = tmp[1];
     let fArgs = tmp[2];
     console.log("postQ",id,fName,fArgs);
     //If promises have been made, run the resolve or reject functions
     let f = "resolve";
    if(fArgs!==null){
     if(fArgs[0]==="'"){
       f = "reject";
     }
    };
    this.state.ws.postQ[id][f](fArgs);
  };

  render() {
    return (
      <div className={this.state.isNight ? 'nightMode' : 'dayMode'}>
        <Tabs
          table={this.state.table}
          table2={this.state.table2}
          cellChange = {this.cellChange}
          editRow={this.editRow}
          keyDown={this.keyDown}
          wheel={this.wheel}
          monthMessage={this.state.monthMessage}
          sort={this.state.sort}
          updateSort={this.updateSort}
          isNight={this.state.isNight}
          updateCSS={this.updateCSS}
          tabChange={this.tabChange}
          currentTab={this.state.currentTab}
          activeConnection={this.state.activeConnection}
        />
      </div>
    );
  }
}

export default App;

