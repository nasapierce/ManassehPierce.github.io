var app = angular.module("ModPE",[]);
app.controller("Page", function($scope){
	$scope.page = 1;
	$scope.min = 1;
	$scope.max = 1;
	$scope.next = function(){
		if($scope.page !== $scope.max) {
			$scope.page++;
		}
	};
	$scope.last = function() {
		if($scope.page !== $scope.min) {
			$scope.page--;
		}
	};
});

app.controller("Posts",function($scope){
	$scope.posts = [
		{
			title: "Introduction", 
			content: "ModPE is a Modding API in Blocklauncher for MCPE on Android. \
			at the moment I am typing this, there is no ModPE support for IOS. \
			ModPE is JavaScript or ECMAScript, not C++. ModPE was orianally developed by treebl for IOS, but he soon left it to be history. \
			MCPE is developed in C++, C# and other stuff NOT Java or JavaScript. \
			To learn how ModPE works, you should first learn JavaScript, I have links below of some sites I recommend.", 
			actions: [
				"<div class='col s6 m6 l6'><a class='btn green lighten-2'>W3Schools</a></div>",
				"<div class='col s6 m6 l6'><a class='btn green lighten-2'>Codecademy</a></div>"
			]
		},
		{
			title: "Hooks", 
			content: "Blocklauncher has predefined hooks, as such: <br/>\
			<code><ul>\
			<li>attackHook</li>\
			<li>chatHook</li>\
			<li>destroyBlock</li>\n</li>\
			<li>projectileHitEntityHook</li>\
			<li>eatHook</li>\
			<li>entityAddedHook</li>\
			<li>entityRemovedHook</li>\
			<li>explodeHook</li>\
			<li>serverMessageReceiveHook</li>\
			<li>chatReceiveHook</li>\
			<li>leaveGame</li>\
			<li>deathHook</li>\
			<li>redstoneUpdateHook</li>\
			<li>selectLevelHook</li>\
			<li>newLevel</li>\
			<li>startDestroyBlock</li>\
			<li>projectileHitBlockHook</li>\
			<li>modTick</li>\
			<li>useItem</li>\
			</ul></code><br/> To see the parameters you can go to Blocklauncher > Launcher Options > Nerdy Stuff > Dump script Methods</br>\
			These functions are pretty simple to understand and are straight forward.", 
			actions: []
		},
	];
});

app.filter('unsafe', function($sce) {
	return function(val) {
		return $sce.trustAsHtml(val);
	};
});
