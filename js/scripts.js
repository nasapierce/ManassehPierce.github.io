/*
todo:
	Import code
	Rotations
	Zooming
	Textures?

addBox(0, 0, 0, 16, 16, 16);
addBox(3, 2, 0, 5, 3, 0);
addBox(9, 2, 0, 11, 3, 0);
addBox(8, 3, 0, 14, 4, 0);
addBox(11, 4, 0, 13, 5, 0);
addBox(5, 6, 0, 6, 7, 0);
addBox(8, 7, 0, 12, 8, 0);
addBox(1, 8, 0, 3, 9, 0);
addBox(9, 8, 0, 11, 9, 0);
*/
var bounds = [];

var canvas = document.getElementById("myCanvas");
var iso = new Isomer(canvas);
var context = canvas.getContext("2d");
var askForColor = document.getElementById('askForColor');
var colorPick = document.getElementById("inputColor");

var Shape = Isomer.Shape;
var Point = Isomer.Point;
var Color = Isomer.Color;
var Path = Isomer.Path;
var Vector = Isomer.Vector;
var Cube = Shape.Prism(Point.ORIGIN);

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
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
		var x1 = parseFloat(coords.split(",")[0]);
		var y1 = parseFloat(coords.split(",")[1]);
		var z1 = parseFloat(coords.split(",")[2]);
		var x2 = parseFloat(coords.split(",")[3]);
		var y2 = parseFloat(coords.split(",")[4]);
		var z2 = parseFloat(coords.split(",")[5]);
		
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
		bounds.push({type:"box",x1:x1,y1:y1,z1:z1,x2:x2,y2:y2,z2:z2,color:color,name:"box"+bounds.length,hidden:false});
	}
	refreshList();
}


function addBound(){
	var coords = prompt("Enter Coordinates [Warning: Input no spaces]","0,0,0,1,1,1");
	if(coords){
		var x1 = parseFloat(coords.split(",")[0]);
		var y1 = parseFloat(coords.split(",")[1]);
		var z1 = parseFloat(coords.split(",")[2]);
		var x2 = parseFloat(coords.split(",")[3]);
		var y2 = parseFloat(coords.split(",")[4]);
		var z2 = parseFloat(coords.split(",")[5]);
		
		var color;
		if(askForColor.checked)
			color = new Color(hexToR(colorPick.value), hexToG(colorPick.value), hexToB(colorPick.value));
		else
			color = new Color(Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255));
		
		iso.add(Shape.extrude(new Path([
			new Point(x1*4, z1*4, y1*4), //devide by 4, our "default block size is 4^3"
			new Point(x2*4, z1*4, y1*4),
			new Point(x2*4, z2*4, y1*4),
			new Point(x1*4, z2*4, y1*4)
		]), (y2-y1)*4).rotateZ(Point(8/4,8/4,0), getRotationDeg()), color);
		bounds.push({type:"bound",x1:x1,y1:y1,z1:z1,x2:x2,y2:y2,z2:z2,color:color,name:"box"+bounds.length,hidden:false});
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
	bounds.push({type:"box",x1:x1,y1:y1,z1:z1,x2:x2,y2:y2,z2:z2,color:color,name:"box"+bounds.length,hidden:false});
	refreshList();
}


function addBoundC(x1, y1, z1, x2, y2, z2){
	var color;
	if(askForColor.checked)
		color = new Color(hexToR(colorPick.value), hexToG(colorPick.value), hexToB(colorPick.value));
	else
		color = new Color(Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255));
	
	iso.add(Shape.extrude(new Path([
		new Point(x1*4, z1*4, y1*4), //devide by 4, our "default block size is 4^3"
		new Point(x2*4, z1*4, y1*4),
		new Point(x2*4, z2*4, y1*4),
		new Point(x1*4, z2*4, y1*4)
	]), (y2-y1)*4).rotateZ(Point(8/4,8/4,0), getRotationDeg()), color);
	bounds.push({type:"bound",x1:x1,y1:y1,z1:z1,x2:x2,y2:y2,z2:z2,color:color,name:"box"+bounds.length,hidden:false});
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
		refreshCanvas();
		refreshList();
	}
}


function changeCoords(i){
	var original = bounds[i].x1+","+bounds[i].y1+","+bounds[i].z1+","+bounds[i].x2+","+bounds[i].y2+","+bounds[i].z2 ;
	var coords = prompt("Change Coords of Box "+i+"?",original);
	bounds[i].x1 = parseFloat(coords.split(",")[0]);
	bounds[i].y1 = parseFloat(coords.split(",")[1]);
	bounds[i].z1 = parseFloat(coords.split(",")[2]);
	bounds[i].x2 = parseFloat(coords.split(",")[3]);
	bounds[i].y2 = parseFloat(coords.split(",")[4]);
	bounds[i].z2 = parseFloat(coords.split(",")[5]);
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
	if(bounds[i].type=="box")
		addBoxC(bounds[i].x1, bounds[i].y1, bounds[i].z1, bounds[i].x2, bounds[i].y2, bounds[i].z2);
	else{
		addBoundC(bounds[i].x1, bounds[i].y1, bounds[i].z1, bounds[i].x2, bounds[i].y2, bounds[i].z2);
	}
}


function rename(i){
	var nn = prompt("Rename "+bounds[i].name+"?",bounds[i].name); //bounds[i].name;
	if(nn){
		bounds[i].name = nn;
	}
	refreshList();
}


function refreshList(){
	var boundHolder = document.getElementById("boundHolder");
	boundHolder.innerHTML = "";
	for(var i=0;i<bounds.length;i++){
		var hidden;
		if(!bounds[i].hidden){hidden="Hide";}
		if(bounds[i].hidden){hidden="Show";}
		boundHolder.innerHTML = boundHolder.innerHTML +
		'<div class="row">'+
		'<div class="dropdown">'+
		'<a class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
		bounds[i].name+
		'</a>'+
	    '<div class="dropdown-menu">'+
		'<a class="dropdown-item" onclick="changeCoords('+i+');">Change Coordinates</a>'+
		'<a class="dropdown-item" onclick="changeColor('+i+')">Change Color</a>'+
		'<a class="dropdown-item" onclick="duplicate('+i+');">Duplicate</a>'+
		'<a class="dropdown-item" onclick="rename('+i+');">Rename Box</a>'+
		'<a class="dropdown-item" onclick="hide('+i+');">'+hidden+' Box</a>'+
		'<a class="dropdown-item" onclick="removeBox('+i+');">Delete</a>'+
		'</div>'+
		'</div>'+
		'</div>';
	}
	var e = document.getElementById("export").innerText = "";
}

var rgb = document.getElementById("rgb");
var colorType=0;
function exportBounds(){
	var e = document.getElementById("export");
	e.innerText = "";
	for(var i=0;i<bounds.length;i++){
		var colorText = "";
		if(rgb.checked && colorType==0){colorText="//color: ("+hexToR(bounds[i].color.toHex())+", "+hexToG(bounds[i].color.toHex())+", "+hexToB(bounds[i].color.toHex())+")";}
		if(rgb.checked && colorType==1){colorText="//color: "+bounds[i].color.toHex();}
		if(bounds[i].type=="box")
			e.innerText = e.innerText + "setRenderBounds("+bounds[i].x1/16+", "+bounds[i].y1/16+", "+bounds[i].z1/16+", "+bounds[i].x2/16+", "+bounds[i].y2/16+", "+bounds[i].z2/16+"); "+colorText+"\n";
		if(bounds[i].type=="bound"){
			e.innerText = e.innerText + "setRenderBounds("+bounds[i].x1+", "+bounds[i].y1+", "+bounds[i].z1+", "+bounds[i].x2+", "+bounds[i].y2+", "+bounds[i].z2+"); "+colorText+"\n";
		}
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
		var colorText = "";
		if(rgb.checked && colorType==0){colorText="//color: ("+hexToR(bounds[i].color.toHex())+", "+hexToG(bounds[i].color.toHex())+", "+hexToB(bounds[i].color.toHex())+")";}
		if(rgb.checked && colorType==1){colorText="//color: "+bounds[i].color.toHex();}
		if(bounds[i].type=="box"){
			e.innerText = e.innerText + "addBox("+x1+", "+y1+", "+z1+", "+x2+", "+y2+", "+z2+"); "+colorText+"\n";
		}
		else{
			e.innerText = e.innerText + "addBox("+bounds[i].x1*16+", "+bounds[i].y1*16+", "+bounds[i].z1*16+", "+bounds[i].x2*16+", "+bounds[i].y2*16+", "+bounds[i].z2*16+"); "+colorText+"\n";
		}
	}
}


function refreshCanvas(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	for(var i=0;i<bounds.length;i++){
		if(!bounds[i].hidden && bounds[i].type == "box"){
			iso.add(Shape.extrude(new Path([
				new Point(bounds[i].x1/4, bounds[i].z1/4, bounds[i].y1/4),
				new Point(bounds[i].x2/4, bounds[i].z1/4, bounds[i].y1/4),
				new Point(bounds[i].x2/4, bounds[i].z2/4, bounds[i].y1/4),
				new Point(bounds[i].x1/4, bounds[i].z2/4, bounds[i].y1/4)
			]).rotateZ(Point(8/4,8/4,0), getRotationDeg()), (bounds[i].y2-bounds[i].y1)/4), bounds[i].color);
		}
		if(!bounds[i].hidden && bounds[i].type == "bound"){
			iso.add(Shape.extrude(new Path([
				new Point(bounds[i].x1*4, bounds[i].z1*4, bounds[i].y1*4),
				new Point(bounds[i].x2*4, bounds[i].z1*4, bounds[i].y1*4),
				new Point(bounds[i].x2*4, bounds[i].z2*4, bounds[i].y1*4),
				new Point(bounds[i].x1*4, bounds[i].z2*4, bounds[i].y1*4)
			]).rotateZ(Point(8/4,8/4,0), getRotationDeg()), (bounds[i].y2-bounds[i].y1)*4), bounds[i].color);
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


/*function importCode(){
	var im = document.getElementById("importCode");
	var im1=im.value.split(";");
	alert(im1.length);
	
}*/


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


function tessellateDoubleFence(){
	addBoxC(6, 0, 12, 10, 16, 16);
	addBoxC(7, 4, 0, 9, 6, 12);
	addBoxC(7, 10, 0, 9, 12, 12);
	addBoxC(6, 0, 0, 10, 16, 4);
}
