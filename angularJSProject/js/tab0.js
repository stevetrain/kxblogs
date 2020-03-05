
// Get the module we created in file one
var app = angular.module('MyApp');
app.controller('ctrl0', ctrl0);
// Inject my dependencies
ctrl0.$inject = ['$scope', '$rootScope', 'rs'];

// Now create our controller function with all necessary logic
function ctrl0($scope, $rootScope, rs) {
	console.log("Loading tab0.js");
	var cal;
	if($rootScope.cal===undefined){
        //Define new scopes
        cal = $scope;
        $rootScope.cal=cal;
	}else{
	    cal = $rootScope.cal;
        cal.init();
    };
    //Define old scopes
	var website=rs.website;
    var ws=rs.ws;
    website.currentNavItem='tab0';
	//Display a calendar containing today's date
	let tmp1 = new Date();
	let tmp2 = new Date("08/03/2015");
  cal.index=Math.round((tmp1.getTime()-tmp2.getTime())/(7*24*60*60*1000))-2;
	cal.height=2*cal.index;
	cal.date=website.formatDate(0);;

	cal.formatCell = function(y,z){
	  if(0<=["Mon","Tue","Wed","Thur","Fri","Sat","Sun"].indexOf(z)){
		return (y[z]).split("-").pop();
	  }else{
	    return y[z];
	  };
	};
	
	cal.formatHeader = function(x){
    if(x=="Month"){
		  return x;
	  }else if(x.includes("Comment")){
			return x.slice(0, -7);
	  }else{
	    return "";
	  };
	};

	cal.headerWidth = function(x){
	  if(x=="Month"){
			return "header-month";
	  };
	  if(0<=["Mon","Tue","Wed","Thur","Fri","Sat","Sun"].indexOf(x)){
			return "header-date";
	  };	  
	};
	
	cal.editRow = function(i, kol, data){
	  data=data.srcElement.innerText;
      return ws.qPromise(".cal.editRow",[i, kol, data]);
	};
	
	cal.highlightDate = function(dt){
	  if(dt==null){
			return
		};
    if(((new Date(dt))<new Date()) && (dt.includes("-"))){
		  return "highlight";  
	  };
	};
	
	cal.goLeft = function(){
		let tmp = cal.index - 8;
		if(tmp<0){
			cal.index=0;
		}else{
			cal.index=tmp;
		};
	  cal.getCalendar(cal.index);
	};
	
	cal.goRight = function(){
		let tmp = cal.index + 8;		
		if(tmp>cal.height){
			cal.index=cal.height;
		}else{
			cal.index=tmp;
		};	  
		cal.getCalendar(cal.index);
	};  	
	
	cal.getCalendar = function(i){
	  return ws.qPromise(".cal.getCalendar",i).then(cal.postGetCalendar)
	};

	cal.postGetCalendar = function(data){
      cal.shownSnack=false;
	  cal.calendar=data;
	  tmp=Object.keys(cal.calendar[0]);
	  cal.calendarKeys=[];
	  for(i=0; i<tmp.length; i++){
		if(!tmp[i].startsWith("hidden")){
		cal.calendarKeys.push(tmp[i]);
		};
	  };
	  cal.starting=false;
	  $rootScope.$digest();
	  website.loading=false;
	};

	cal.scroll = function(){
		cal.shownSnack = true;
		$rootScope.$digest();
    cal.date = website.formatDate(cal.index,"08/03/2015");
		cal.snack=cal.date;
	  clearTimeout(cal.scrollTimer);
	  cal.scrollTimer = setTimeout(cal.getCalendar,50,cal.index);
	};

	cal.getHeight = function(obj){
      return ws.qPromise(".cal.getHeight",obj).then(cal.postGetHeight)
	};
	
	cal.postGetHeight = function(data){
	  cal.height=data;
	  cal.getCalendar(cal.index);	  		
	};
	
  cal.initScroll = function(){
		$(document).bind('wheel', function(e){
		  if(e.originalEvent.wheelDelta > 0) {
				if(cal.index>0){
				  cal.$apply(cal.index-= 1);
				}else{
					return;
				};
		  }else{
				if(cal.index<cal.height-8){
				  cal.$apply(cal.index+= 1);
				}else{
					return;
				};
		  };
			cal.scroll();
		});
	};
	
    //Call goLeft and goRight via arrow keys if the user isn't focused on a table cell
    cal.initArrows = function(){
        $("body").off('keydown');
        $('body').keydown(function(event) {
            if(website.tab==0){
                if (!event){
                    event = window.event;
                    var code = event.keyCode;
                }else if (event.charCode && code == 0){
                    code = event.charCode;
                }else{
                    var code = event.keyCode;
                };
                var tmp = $(document.activeElement);
                if(tmp[0].localName=="td"){return};
                switch(code) {
                    case 37:
                        cal.goLeft();
                        break;
                    case 38:
                        if(cal.index!=0){
                            cal.index-=1;
                            cal.getCalendar(cal.index);
                        };
                        break;
                    case 39:
                        cal.goRight();
                        break;
                    case 40:
                        if(cal.index<cal.height){
                            cal.index+=1;
                            cal.getCalendar(cal.index);
                        };
                        break;
                }
            };
        });
    };

  cal.init = function(){
    if(cal.starting===true){
        return;
    }
    if(ws.readyState!==1){
       setTimeout(cal.init,1000);
       return;
    };
    console.log("Initialising Calendar");
    cal.starting=true;
    cal.getHeight();
    cal.initScroll();
    cal.initArrows();
  };
}