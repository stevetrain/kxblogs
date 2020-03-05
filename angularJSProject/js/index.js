var app = angular.module('MyApp',['ngRoute','ngMaterial','ngMessages', 'ui.toggle']);

app.service('rs', function($rootScope){
  if(!("WebSocket" in window)){
		alert("WebSockets not supported on your browser.")
		return {};
	};
	var website = {};
	$rootScope.website=website;
		website.tabNames = ["Calendar","OtherTab"];
		website.tab=0;
		website.monthNames = [
			"January", "February", "March",
			"April", "May", "June", "July",
			"August", "September", "October",
			"November", "December"
    ];
		website.isNight=false;
		website.loading=true;
		website.id=0;

		website.updateTab = function(index){
			website.tab=index;
			let x = (index===0) ? "hidden" : "initial";
	        $('body').css("overflow",x);
		};
		website.formatDate = function(i,d){
			if(d==undefined){
				d = new Date();
			}else{
			  d = new Date(d);
			};
			d.setDate(d.getDate()+(i*7));
			var month = d.getMonth();
			var year = d.getFullYear();
			return website.monthNames[month] + ' ' + year;
		};
		website.updateCSS = function(){
		    let newClass = website.isNight ? 'nightMode' : 'dayMode';
		    let oldClass = !website.isNight ? 'nightMode' : 'dayMode';
		    $("."+oldClass).attr('class', newClass);
		}
	var defineWS = function(){
	  website.loading=true;
	  ws = null;
	  ws = new WebSocket("ws://localhost:5001/");
	  $rootScope.ws = ws;
    //Sends a message to q via the websockets and logs the function and arguments
	  ws.q = function (id, func, obj, resolve, reject){
			console.log(id, func, obj);
			ws.postQ[id] = {resolve,reject};
			return ws.send(JSON.stringify({id, func,obj}));
	  };
	  //Creates a promise, which will be resolved after data is returned from q, and trigger any corresponding .then functions.
	  ws.qPromise = function(func, obj){
	    website.id+=1;
		return new Promise(function(resolve,reject){
			ws.q(website.id, func, obj, resolve, reject);
		})
	  };
	  ws.onclose=function(e){
	     $(".loader").show();
	     console.log('Websocket closed');
         setTimeout(function() {
           defineWS();
         }, 1000);
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
         ws.postQ[id][f](fArgs);
	  };
	    ws.onerror = function(err) {
          console.error('Socket encountered error: ', err.message, 'Closing socket');
          ws.close();
        };

		//After the websocket is opened, and the home page init function is defined, populate the home page
		ws.onopen=function(e){
		    console.log('websocket opened')
		    $(".loader").hide();
		};
		ws.postQ={};
	};
  defineWS();
  return $rootScope;
  })

app.config(['$routeProvider',function($routeProvider){
    $routeProvider.when('/', {
        templateUrl : 'tab0.html',
        controller : 'ctrl0'
    }).when('/otherTab', {
        templateUrl : 'tab1.html',
        controller : 'ctrl1'
    }).otherwise({
        template:"Page not found"
    });
}])