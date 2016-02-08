
function intToBinary(int){
    var binStr = parseInt(int, 10).toString(2);
	binStr = "0".repeat(8 - binStr.length) + binStr;
	return binStr;
}

function binaryToInt(bin) {
	return parseInt(bin, 2);
}

var posts = [
	{
		title: 'Welcome',
		hidden: false,
		content: 'Welcome to <a href="http://manassehpierce.github.io/" class="blue-text">ManassehPierce.github.io</a>! \
			Here I have a collection of my Web Development and MCPE Development. I have things from THREEJS to MCPE Scripts. \
			Please explore, and if you like my page and/or have a suggestion, please tell me <a href="https://twitter.com/pierce_manasseh/" class="blue-text" target="blank">here</a>.',
		actions: []
	},
	{
		title: "0.14.x functions",
		hidden: false,
		content: "Search for every function in MCPE based on Class",
		actions: ["<a class='btn blue lighten-2' href='search.html'>Search Page</a>"]
	},
	{
		title: "ExNihilo PE",
		hidden: false,
		content: "Ex Nihilo is a Minecraft Skyblock Companion mod. It allows the Player to do so much more in Skyblock. \
					I am currently bringing the mod to PE, after about a year of not making the mod I have started from scratch.",
		actions: [
			'<a class="btn blue lighten-2" href="https:\/\/github.com/ManassehPierce/ExNihilo-PE">Github</a>'
		]
	},
	{
		title: "ModPE",
		hidden: true,
		content: "Learn ModPE, some ModPE Tips, and some other things trivial!",
		actions: [
			'<a class="btn blue lighten-2" href="modpe.html">ModPE</a>'
		]
	},
];

var app = angular.module("myApp",[]);
app.controller("myCtrl",function($scope){
	$scope.posts = posts;
	$scope.$on('loaded', function(ngRepeatFinishedEvent) {
		$scope.loaded = true;
	});
});

app.directive('onFinishRender', function ($timeout) {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			if (scope.$last === true) {
				$timeout(function () {
					scope.$emit(attr.onFinishRender);
				});
			}
		}
	};
});

app.filter('unsafe', function($sce) {
	return function(val) {
		return $sce.trustAsHtml(val);
	};
});

app.controller("IPCalc",function($scope){
	$scope.oct0 = 0;
	$scope.oct1 = 0;
	$scope.oct2 = 0;
	$scope.oct3 = 0;
	$scope.prefix = 24;
	
	$scope.class = function() {
		if($scope.prefix >= 8 && $scope.prefix <= 15) return "A";
		else if($scope.prefix >= 16 && $scope.prefix <= 23) return "B";
		else if($scope.prefix >= 24 && $scope.prefix <= 30) return "C";
		else return "";
	};
	
	$scope.IPBinary = function() {
		var ipBin = [
			intToBinary($scope.oct0 ? $scope.oct0 : 0),
			intToBinary($scope.oct1 ? $scope.oct1 : 0),
			intToBinary($scope.oct2 ? $scope.oct2 : 0),
			intToBinary($scope.oct3 ? $scope.oct3 : 0)
		];
		return ipBin.join(".");
	};
	
	$scope.subnetBits = function() {
		if($scope.class() == "A") return $scope.prefix - 8;
		else if($scope.class() == "B") return $scope.prefix - 16;
		else if($scope.class() == "C") return $scope.prefix - 24;
		else return 0;
	};
	
	$scope.subnetMask = function() {
		var mask = "1".repeat($scope.prefix);
		mask += "0".repeat(32-mask.length);
		mask = mask.replace(/\s*[01]{8}\s*/g, function(mask) {return parseInt(mask, 2).toString() + ".";});
		return mask.substring(0, mask.length-1);
	};
	
	$scope.subnetBinary = function() {
		var subnetBin = "1".repeat($scope.prefix);
		subnetBin += "0".repeat(32 - subnetBin.length);
		subnetBin = subnetBin.insert(8, ".").insert(17, ".").insert(26, ".");
		return subnetBin;
	};
	
	$scope.totalSubnets = function() {
		return Math.pow(2, $scope.subnetBits());
	};
	
	$scope.networkAddress = function() {
		var netBin = "";
		for(var i=0;i<35;i++){
			if($scope.IPBinary()[i] == $scope.subnetBinary()[i]){
				netBin += $scope.IPBinary()[i];
			} else {
				netBin += "0";
			}
		}
		$scope.networkBinary = netBin;
		var net = netBin.split(".");
		net[0] = binaryToInt(net[0]);
		net[1] = binaryToInt(net[1]);
		net[2] = binaryToInt(net[2]);
		net[3] = binaryToInt(net[3]);
		return net.join(".");
	};
	
	$scope.hostsPerSubnet = function() {
		return Math.pow(2, 32-$scope.prefix) - 2;
	};
	
	$scope.hostsLostToSubnets = function() {
		$scope.hostCount = (Math.pow(2, 32-$scope.prefix) - 2) * $scope.totalSubnets();
		if($scope.class() == "A") return (16777214 - $scope.hostCount);
		else if($scope.class() == "B") return (65534 - $scope.hostCount);
		else if($scope.class() == "C") return (254 - $scope.hostCount);
		else return;
	};
});

