
var bounds = [];

var canvas = document.getElementById("myCanvas");
var iso = new Isomer(canvas);
var context = canvas.getContext("2d");
var askForColor = document.getElementById('askForColor');
var colorPick = document.getElementById("colorPick");

var Shape = Isomer.Shape;
var Point = Isomer.Point;
var Color = Isomer.Color;
var Path = Isomer.Path;
var Vector = Isomer.Vector;
var Cube = Shape.Prism(Point.ORIGIN);


function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

var rotation = 2;
function getRotationDeg(){
	switch(rotation){
		case 2:
			return 0;
			break;
		case 3:
			return Math.PI;
			break;
		case 4:
			return Math.PI*0.5;
			break;
		case 5:
			return Math.PI*1.5;
			break;
	}
}
/* rotations
north z- 2
south z+ 3
west x- 4
east x+ 5
*/

function addBox(){
	var coords = prompt("Enter Coordinates [Warning: Input no spaces]","0,0,0,16,16,16");
	if(coords){
		var x1 = parseInt(coords.split(",")[0]);
		var y1 = parseInt(coords.split(",")[1]);
		var z1 = parseInt(coords.split(",")[2]);
		var x2 = parseInt(coords.split(",")[3]);
		var y2 = parseInt(coords.split(",")[4]);
		var z2 = parseInt(coords.split(",")[5]);
		
		var color;
		if(askForColor.checked)
			color = new Color(hexToR(colorPick.value), hexToG(colorPick.value), hexToB(colorPick.value));
		else
			color = new Color(Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255));
		
		iso.add(Shape.extrude(new Path([
			new Point(x1/4, z1/4, y1/4), //devide by 4, our "default block size is 4^3"
			new Point(x2/4, z1/4, y1/4),
			new Point(x2/4, z2/4, y1/4),
			new Point(x1/4, z2/4, y1/4)
		]), (y2-y1)/4).rotateZ(Point(8/4,8/4,0), getRotationDeg()), color);
		bounds.push({x1:x1,y1:y1,z1:z1,x2:x2,y2:y2,z2:z2,color:color,name:"box"+bounds.length,hidden:false});
	}
	refreshList();
}


function addBoxC(x1, y1, z1, x2, y2, z2) {
 	var color;
	if(askForColor.checked)
		color = new Color(hexToR(colorPick.value), hexToG(colorPick.value), hexToB(colorPick.value));
	else
		color = new Color(Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255));
		
	iso.add(Shape.extrude(new Path([
		new Point(x1/4, z1/4, y1/4), //devide by 4, our "default block size is 4^3"
		new Point(x2/4, z1/4, y1/4),
		new Point(x2/4, z2/4, y1/4),
		new Point(x1/4, z2/4, y1/4)
	]), (y2-y1)/4).rotateZ(Point(8/4,8/4,0), getRotationDeg()), color);
	bounds.push({x1:x1,y1:y1,z1:z1,x2:x2,y2:y2,z2:z2,color:color,name:"box"+bounds.length,hidden:false});
	
	refreshList();
}


function removeBox(i){
	var ok = confirm("Delete Box "+i+"? It will be lost forever.");
	if(ok){
		bounds.splice(i, 1);
		refreshCanvas();
		refreshList();
	}
}


function resetBounds(){
	var ok = confirm("Reset all canvas? All boxes will be lost!");
	if(ok){
		bounds.splice(0, bounds.length);
		refreshList();
		refreshCanvas();
	}
}


function changeCoords(i){
	var original = bounds[i].x1+","+bounds[i].y1+","+bounds[i].z1+","+bounds[i].x2+","+bounds[i].y2+","+bounds[i].z2 ;
	var coords = prompt("Change Coords of Box "+i+"?",original);
	bounds[i].x1 = parseInt(coords.split(",")[0]);
	bounds[i].y1 = parseInt(coords.split(",")[1]);
	bounds[i].z1 = parseInt(coords.split(",")[2]);
	bounds[i].x2 = parseInt(coords.split(",")[3]);
	bounds[i].y2 = parseInt(coords.split(",")[4]);
	bounds[i].z2 = parseInt(coords.split(",")[5]);
	refreshCanvas();
	refreshList();
}


function changeColor(i){
var ok = confirm("Set Color of box to selected color?");
	if(ok){
		bounds[i].color = new Color(hexToR(colorPick.value), hexToG(colorPick.value), hexToB(colorPick.value));
		refreshCanvas();
	}
	refreshList();
}


function duplicate(i){
	addBoxC(bounds[i].x1, bounds[i].y1, bounds[i].z1, bounds[i].x2, bounds[i].y2, bounds[i].z2);
}


function rename(i){
	var nn = prompt("Rename "+bounds[i].name+"?",bounds[i].name); //bounds[i].name;
	if(nn){
		bounds[i].name = nn;
	}
	refreshList();
}


function refreshList(){
	var myBoxes = document.getElementById("myBoxes");
	myBoxes.innerHTML = "";
	for(var i=0;i<bounds.length;i++){
		var hidden;
		if(!bounds[i].hidden){hidden="Hide";}
		if(bounds[i].hidden){hidden="Show";}
		myBoxes.innerHTML = myBoxes.innerHTML +
'<label for="box'+i+'">'+bounds[i].name+':</label><br/>'+
'<div class="btn-group" role="group" id="box'+i+'">'+
'<button type="button" class="btn btn-lg btn-primary" onclick="changeCoords('+i+');">Coords</button>'+
'<button type="button" class="btn btn-lg btn-success" onclick="changeColor('+i+')">Color</button>'+
'<button type="button" class="btn btn-lg btn-warning" onclick="duplicate('+i+');">Duplicate</button>'+
'<button type="button" class="btn btn-lg btn-info" onclick="rename('+i+');">Rename</button>'+
'<button type="button" class="btn btn-lg btn-default" onclick="hide('+i+');">'+hidden+'</button>'+
'<button type="button" class="btn btn-lg btn-danger" onclick="removeBox('+i+');">Delete</button>'+
'</div><br/>';
	}
	var e = document.getElementById("export").innerText = "";
}


function exportBounds(){
	var e = document.getElementById("export");
	e.innerText = "";
	for(var i=0;i<bounds.length;i++){
		var e = document.getElementById("export");
		e.innerText = e.innerText + "setRenderBounds("+bounds[i].x1/16+", "+bounds[i].y1/16+", "+bounds[i].z1/16+", "+bounds[i].x2/16+", "+bounds[i].y2/16+", "+bounds[i].z2/16+");\n";
	}
}


function exportBox(){
	var x1,x2,y1,y2,z1,z2;
	var e = document.getElementById("export");
	e.innerText = "";
	for(var i=0;i<bounds.length;i++){
		x1 = bounds[i].x1;
		y1 = bounds[i].y1;
		z1 = bounds[i].z1;
		x2 = bounds[i].x2;
		y2 = bounds[i].y2;
		z2 = bounds[i].z2;
		
		if(rotation == 3){ //south
			var x1t = 16-x1; //if x1 = 0 then x1t should = 16
			var x2t = 16-x2; //if x2 = 1 then x2t should = 15
			x1 = x2t;
			x2 = x1t;
		}
		
		var e = document.getElementById("export");
		e.innerText = e.innerText + "addBox("+x1+", "+y1+", "+z1+", "+x2+", "+y2+", "+z2+");\n";
	}
}


function refreshCanvas(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	for(var i=0;i<bounds.length;i++){
		if(!bounds[i].hidden){
			iso.add(Shape.extrude(new Path([
				new Point(bounds[i].x1/4, bounds[i].z1/4, bounds[i].y1/4),
				new Point(bounds[i].x2/4, bounds[i].z1/4, bounds[i].y1/4),
				new Point(bounds[i].x2/4, bounds[i].z2/4, bounds[i].y1/4),
				new Point(bounds[i].x1/4, bounds[i].z2/4, bounds[i].y1/4)
			]).rotateZ(Point(8/4,8/4,0), getRotationDeg()), (bounds[i].y2-bounds[i].y1)/4), bounds[i].color);
		}
	}
}

function summonHALP(){
	var msg = 
	"	This is a simple 3D Block Tessellator Renderer, "+
	"it exports coordinates for developers to use in their MCPE Addon(Native Mod).\n "+
	'	"What does it export?" setRenderBounds(minX, minY, minZ, maxX, maxY, maxZ); which is a simple function which sets bounds of TileTessellator.\n '+
	'	"Uhhh... what?" If you aren\'t a modder you are probably here because you like mod Tessellation, and if you want to know how to use this follow the instructions below.\n'+
	'	First, the Coordinates(Coords) are minX, minY, minZ, maxX, maxY, maxZ, X will go to one side, while Z will go the other, and Y will go up or down.\n'+
	'	You may want to know, never make the minimum x, y, or z, smaller than its maximum. that will make it inverted.\n'+
	'	Next, I want to tell you to start with the back/bottom of the render first, then work your way up/forward.\n'+
	'	This web app is in development and is subject to change, this was made using IsomerJS which is under the MIT license.'
	;
	alert(msg);
}

function hide(i){
	if(bounds[i].hidden){
		bounds[i].hidden = false;
	}
	else{
		bounds[i].hidden = true;
	}
	refreshList();
	refreshCanvas();
}

/* Tessellations */
function tessellateDragonEgg(){
	addBoxC(2, 0, 2, 14, 3, 14);
	addBoxC(1, 3, 1, 15, 7, 15);
	addBoxC(2, 7, 2, 14, 10, 14);
	addBoxC(3, 10, 3, 13, 12, 13);
	addBoxC(4, 12, 4, 12, 13, 12);
	addBoxC(5, 13, 5, 11, 14, 11);
	addBoxC(6, 14, 6, 10, 15, 10);
}


function tessellateFlippedTable(){
	addBoxC(0, 0, 0, 1*16, 0.125*16, 1*16);
	addBoxC(0.875*16, 0.125*16, 0.875*16, 1*16, 0.875*16, 1*16);
	addBoxC(0, 0.125*16, 0.875*16, 0.125*16, 0.875*16, 1*16);
	addBoxC(0.875*16, 0.125*16, 0, 1*16, 0.875*16, 0.125*16);
	addBoxC(0, 0.125*16, 0, 0.125*16, 0.875*16, 0.125*16);
}


function tessellateChest(){
	addBoxC(0, 0, 0, 16, 11, 16);
	addBoxC(0, 11, 0, 16, 12, 16);
	addBoxC(0, 12, 0, 16, 16, 16);
	addBoxC(7, 9, 0, 9, 13, 1);
}
