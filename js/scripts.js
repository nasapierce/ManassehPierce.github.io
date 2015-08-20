
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


function addBox(){
	var coords = prompt("Enter Coordinates [Warning: Input no spaces]","0,0,0,16,16,16");
	
	var c = new Color(hexToR(colorPick.value), hexToG(colorPick.value), hexToB(colorPick.value));
	var randomColor = new Color(Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255));
	
	if(coords){
		var x1 = parseInt(coords.split(",")[0]);
		var y1 = parseInt(coords.split(",")[1]);
		var z1 = parseInt(coords.split(",")[2]);
		var x2 = parseInt(coords.split(",")[3]);
		var y2 = parseInt(coords.split(",")[4]);
		var z2 = parseInt(coords.split(",")[5]);
		
		if(!askForColor.checked){
			iso.add(Shape.extrude(new Path([
				new Point(x1/4, z1/4, y1/4), //devide by 4, our "default block size is 4^3"
				new Point(x2/4, z1/4, y1/4),
				new Point(x2/4, z2/4, y1/4),
				new Point(x1/4, z2/4, y1/4)
			]), (y2-y1)/4), randomColor);
			bounds.push({x1:x1,y1:y1,z1:z1,x2:x2,y2:y2,z2:z2,color:randomColor});
		} else {
			iso.add(Shape.extrude(new Path([
				new Point(x1/4, z1/4, y1/4),
				new Point(x2/4, z1/4, y1/4),
				new Point(x2/4, z2/4, y1/4),
				new Point(x1/4, z2/4, y1/4)
			]), (y2-y1)/4), c);
			bounds.push({x1:x1,y1:y1,z1:z1,x2:x2,y2:y2,z2:z2,color:c});
		}
	}
	refreshList();
}


function addBoxC(x1, y1, z1, x2, y2, z2) {
 	var c = new Color(hexToR(colorPick.value), hexToG(colorPick.value), hexToB(colorPick.value));
	var randomColor = new Color(Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255)); 	
	
	if(!askForColor.checked){
 		iso.add(Shape.extrude(new Path([
			new Point(x1/4, z1/4, y1/4),
 			new Point(x2/4, z1/4, y1/4),
 			new Point(x2/4, z2/4, y1/4), 
			new Point(x1/4, z2/4, y1/4)
		]), (y2-y1)/4), randomColor);
 		bounds.push({x1:x1,y1:y1,z1:z1,x2:x2,y2:y2,z2:z2,color:randomColor});
	} else {
		iso.add(Shape.extrude(new Path([
			new Point(x1/4, z1/4, y1/4),
 			new Point(x2/4, z1/4, y1/4),
 			new Point(x2/4, z2/4, y1/4),
 			new Point(x1/4, z2/4, y1/4)
		]), (y2-y1)/4), c);
 		bounds.push({x1:x1,y1:y1,z1:z1,x2:x2,y2:y2,z2:z2,color:c});
	}
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


function refreshList(){
	var myBoxes = document.getElementById("myBoxes");
	myBoxes.innerHTML = "";
	for(var i=0;i<bounds.length;i++){
		myBoxes.innerHTML = myBoxes.innerHTML +
'<label for="box'+i+'">Box '+i+':</label>'+
'<div class="btn-group" role="group" id="box'+i+'">'+
'<button type="button" class="btn btn-lg btn-info" onclick="changeCoords('+i+');">Coords</button>'+
'<button type="button" class="btn btn-lg btn-success" onclick="changeColor('+i+')">Color</button>'+
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


function refreshCanvas(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	for(var i=0;i<bounds.length;i++){
		iso.add(Shape.extrude(new Path([
			new Point(bounds[i].x1/4, bounds[i].z1/4, bounds[i].y1/4),
			new Point(bounds[i].x2/4, bounds[i].z1/4, bounds[i].y1/4),
			new Point(bounds[i].x2/4, bounds[i].z2/4, bounds[i].y1/4),
			new Point(bounds[i].x1/4, bounds[i].z2/4, bounds[i].y1/4)
		]), (bounds[i].y2-bounds[i].y1)/4), bounds[i].color);
	}
}


/* Tessellations */
function tessellateDragonEggInWorld(){
	addBoxC(2, 0, 2, 14, 3, 14);
	addBoxC(1, 3, 1, 15, 7, 15);
	addBoxC(2, 7, 2, 14, 10, 14);
	addBoxC(3, 10, 3, 13, 12, 13);
	addBoxC(4, 12, 4, 12, 13, 12);
	addBoxC(5, 13, 5, 11, 14, 11);
	addBoxC(6, 14, 6, 10, 15, 10);
}
