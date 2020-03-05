// Get the module we created in file one
var app = angular.module('MyApp');
app.controller('ctrl1', ctrl1);

// Inject my dependencies
ctrl1.$inject = ['$scope', '$rootScope', 'rs'];

// Now create our controller function with all necessary logic
function ctrl1($scope, $rootScope, rs) {
	console.log("Loading tab1.js");
	if($rootScope.tab1===undefined){
        //Define new scopes
        var tab1 = $scope;
        $rootScope.tab1=tab1;
	}else{
        tab1=$rootScope.tab1;
        tab1.init();
    }
    $(document).off('wheel');
    tab1.starting=true;
	//Define old scopes
    var website=rs.website;
    var ws=rs.ws;
    website.currentNavItem='tab1';
    tab1.index=0;
    tab1.sort=0;
    tab1.radios=["Unsorted","Ascending","Descending"];

	tab1.init = function(){
        if(ws.readyState!==1){
           setTimeout(tab1.init,1000);
           return;
        };
		console.log("Initialising tab1");
		tab1.example=["Other Tab"];
    };
}