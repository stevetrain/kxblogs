import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cal',
  templateUrl: './cal.component.html',
  styleUrls: ['./cal.component.css']
})
export class CalComponent implements OnInit {
  //@Input() node: Node;
  @Output() loading = new EventEmitter<boolean>();
  constructor(private route: ActivatedRoute,) { }

  //globals

  //Declare an array of objects, with a key (Month) with values of type string
  calendar : {Month: string; Mon: string; MonComment: string; Tue: string; TueComment: string; Wed: string; WedComment: string; Thur: string;
  ThurComment : string; Fri: string; FriComment: string; Sat: string; SatComment: string; Sun: string; SunComment: string; hiddenIndex:number}[];
  //Define an array of strings containing the display columns
  calendarKeys : string[] = ["Month","Mon","MonComment","Tue","TueComment","Wed","WedComment","Thur","ThurComment","Fri","FriComment","Sat","SatComment","Sun","SunComment"];
  monthNames : string[] = ["January", "February", "March","April", "May", "June", "July","August", "September", "October","November", "December"];
  index : number = 0;
  height : number = 0;
  ws : {readyState:number, qPromise:any};
  snack : string = "";
  shownSnack : Boolean = false;
  scrollTimer : any;

  ngOnInit(): void {
     console.log('Initialising cal');
     console.log(this);
     let tmp1 = new Date();
     let tmp2 = new Date("08/03/2015");
     this.index = Math.round((tmp1.getTime()-tmp2.getTime())/(7*24*60*60*1000))-2;
     try {
       window.addEventListener('keydown', e => {
         this.useArrows(e);
       });
       this.getHeight(null);
     }
     catch(err) {
       console.log('Cal init failed');
     }
  }

  //funcs - ES6 => notation is used to avoid having to use .bind(this) in .then promises

  //Change date via arrow keys if the user isn't focused on a table cell
  useArrows = (event: any) => {
    if(document.activeElement.localName=="td"){return};
    if (!event){
      event = window.event;
      var code = event.keyCode;
    }else if (event.charCode && code == 0){
      code = event.charCode;
    }else{
      var code = event.keyCode;
    };
    switch(code) {
      //left
      case 37:
	  var tmp : number = this.index - 8;
	  if(tmp<0){
	    this.index=0;
	  }else{
	    this.index=tmp;
	  };
	  break;
      //up
      case 38:
        if(this.index!=0){
          this.index-=1;
        };
        break;
      //right
      case 39:
	  var tmp : number = this.index + 8;
	  if(tmp<0){
	    this.index=0;
	  }else{
	    this.index=tmp;
	  };
	  break;
      //down
      case 40:
        if(this.index<this.height){
          this.index+=1;
        };
        break;
    }
    this.getCalendar(this.index);
  };

  getHeight = (obj: void) => {
    console.log('getHeight');
    if(this.ws===undefined){console.log('not ready'); setTimeout(this.getHeight,300); return};
    if(this.ws.readyState!==1){console.log('not ready'); setTimeout(this.getHeight,300); return};
    console.log('ready');
    return this.ws.qPromise(".cal.getHeight",obj)
      .then(this.postGetHeight)
      .catch(function(e){alert(".cal.getHeight failed due to: "+e)})
      .then(this.getCalendar);
  };

  postGetHeight = (height: number) => {
    this.height=height;
	return this.index;
  }

  getCalendar = (i : number) => {
	return this.ws.qPromise(".cal.getCalendar",i).then(this.postGetCalendar)
  };

  postGetCalendar = (data: any) => {
    this.calendar=data;
    this.shownSnack=false;
    //Pass up to app.component.ts
    this.loading.emit(false);
  };

  editRow = (i:number, kol:string, e:any) => {
    let text:string = e.target.textContent;
    return this.ws.qPromise(".cal.editRow",[i, kol, text]).then(this.postEditRow).catch(this.error)
  };

  postEditRow = function(data:any){
    console.log(['postEditRow',data]);
  };

  wheel = (e:any) => {
    let polarity:number = e.wheelDelta;
    if(polarity > 0) {
      if(this.index>0){
        this.index-= 1;
      }else{
        return;
      };
    }else{
      if(this.index<this.height-8){
        this.index+= 1;
      }else{
        return;
      };
    };
    this.snack=this.formatDate(this.index,"08/03/2015");
    this.shownSnack=true;
	clearTimeout(this.scrollTimer);
	this.scrollTimer = setTimeout(this.getCalendar,50,this.index);
  };

  formatDate = function(i:number,d:any){
    if(d===undefined){
      d = new Date();
    }else{
      d = new Date(d);
    };
    d.setDate(d.getDate()+(i*7));
    var month = d.getMonth();
    var year = d.getFullYear();
    return this.monthNames[month] + ' ' + year;
  };

  error = (obj: any) => {
    console.log(obj);
  };

  formatHeader = function(x){
    if(x=="Month"){
      return x;
    }else if(x.includes("Comment")){
      return x.slice(0, -7);
    }else{
      return "";
    };
  };

  headerWidth = function(x){
    if(x=="Month"){
      return "header-month";
    };
    if(0<=["Mon","Tue","Wed","Thur","Fri","Sat","Sun"].indexOf(x)){
      return "header-date";
    };
  };

  formatCell = function(y,z){
    if(0<=["Mon","Tue","Wed","Thur","Fri","Sat","Sun"].indexOf(z)){
      return (y[z]).split("-").pop();
    }else{
      return y[z].replace("&nbsp;","")
    };
  };

  highlightDate = function(dt, col:string){
    if(dt===null){
      return;
    };
    if(col==='Month'){return 'highlight header-month'};
    let pastDate : Boolean = (((new Date(dt))<new Date()) && (dt.includes("-")));
    if(pastDate){return 'highlight'};
  };

  isEditable = function (col){
    return col.includes('Comment');
  };
}
