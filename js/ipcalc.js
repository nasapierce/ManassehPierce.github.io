
var ipList;
var octect0, octect1, octect2, octect3, prefix;
var mask0, mask1, mask2, mask3;
var netBits, hostBits, subnetBits, netBin, netDec;
var ipClass, ipBin;
var subnetDec, subnetBin;
var subnetCount, hostCount, hostsPerSubnet;

function init() {
	octect0 = document.getElementById("octect0");
	octect1 = document.getElementById("octect1");
	octect2 = document.getElementById("octect2");
	octect3 = document.getElementById("octect3");
	prefix = document.getElementById("prefix");
	ipList = document.getElementById("ipList");
	ipList.innerHTML = "";
	classType();
	ipToBinary();
	networkBits();
	subnetToBinary();
	subnetToDec();
	calcAmounts();
	networkAddress();
}

function classType() {
	if( prefix.value < 8 ) {
		alert("invalid mask");
	}
	else if( prefix.value >= 8 && prefix.value <= 15 ) {
		ipClass = "A";
	}
	else if( prefix.value >= 16 && prefix.value <= 23 ) {
		ipClass = "B";
	}
	else {
		ipClass = "C";
	}
	ipList.innerHTML = ipList.innerHTML + "<li>Class: " + ipClass + "</li>";
}

function ipToBinary() {
	ipBin = intToBinary(octect0.value) + "." + intToBinary(octect1.value) + "." + intToBinary(octect2.value) + "." + intToBinary(octect3.value);
	ipList.innerHTML = ipList.innerHTML + "<li>IP Binary: " + ipBin + "</li>";
}

function networkBits() {
	netBits = prefix.value;
	hostBits = 32 - prefix.value;
	if(ipClass == "A") subnetBits = prefix.value - 8;
	if(ipClass == "B") subnetBits = prefix.value - 16;
	if(ipClass == "C") subnetBits = prefix.value - 24;
	ipList.innerHTML = ipList.innerHTML + "<li>Network Bits: " + netBits + "</li>";
	ipList.innerHTML = ipList.innerHTML + "<li>Host Bits: " + hostBits + "</li>";
	ipList.innerHTML = ipList.innerHTML + "<li>Bits Borrowed: " + subnetBits + "</li>";
}

function subnetToBinary() {
	var a = "", r = "", f = "";
	for(var i=0;i<subnetBits;i++){
		a += "1";
	}
	for(var i=0;i<(8-a.length);i++){
		r += "0";
	}
	for(var i=0;i<((netBits-subnetBits)/8);i++){
		f += "11111111.";
	}
	subnetBin = f + a + r;
	if(subnetBin.length == 17) {
		subnetBin += ".00000000.00000000";
	}
	if(subnetBin.length == 26) {
		subnetBin += ".00000000";
	}
	ipList.innerHTML = ipList.innerHTML + "<li>Subnet Binary: " + subnetBin + "</li>";
}

function calcAmounts() {
	subnetCount = Math.pow(2, subnetBits);
	hostsPerSubnet = Math.pow(2, hostBits) - 2;
	hostCount = hostsPerSubnet * subnetCount;
	ipList.innerHTML = ipList.innerHTML + "<li>Number of Subnets: " + subnetCount + "</li>";
	ipList.innerHTML = ipList.innerHTML + "<li>Hosts per Subnet: " + hostsPerSubnet + "</li>";
	ipList.innerHTML = ipList.innerHTML + "<li>Total hosts: " + hostCount + "</li>";
}

function subnetToDec() {
	var octets = subnetBin.split(".");
	mask0 = binaryToInt(octets[0]);
	mask1 = binaryToInt(octets[1]);
	mask2 = binaryToInt(octets[2]);
	mask3 = binaryToInt(octets[3]);
	subnetDec = mask0 + "." + mask1 + "." + mask2 + "." + mask3;
	ipList.innerHTML = ipList.innerHTML + "<li>Subnet Dec: " + subnetDec + "</li>";
}

function networkAddress() {
	netBin = "";
	for(var i=0;i<35;i++){
		if(ipBin[i] == subnetBin[i]){
			netBin += ipBin[i];
		} else {
			netBin += "0";
		}
	}
	var netBinSplit = netBin.split(".");
	netDec = binaryToInt(netBinSplit[0]) + "." + binaryToInt(netBinSplit[1]) + "." + binaryToInt(netBinSplit[2]) + "." + binaryToInt(netBinSplit[3]); 
	ipList.innerHTML = ipList.innerHTML + "<li>Network Address: " + netDec + "</li>";
	ipList.innerHTML = ipList.innerHTML + "<li>Network Address: " + netBin + "</li>";
}

function intToBinary(int){
    var binStr = parseInt(int, 10).toString(2);
	var r = "";
	for(var i=0;i<(8 - binStr.length);i++){
		r += "0";
	}
	r += binStr;
	return r;
}

function binaryToInt(binaryString) {
	return parseInt(binaryString, 2);
}

