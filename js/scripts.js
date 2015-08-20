var Shape = Isomer.Shape;
var Point = Isomer.Point;
var Color = Isomer.Color;
var Path = Isomer.Path;
var Vector = Isomer.Vector;
var Cube = Shape.Prism(Point.ORIGIN);

var iso = new Isomer(document.getElementById("myCanvas"));

var askForColor = document.getElementById('askForColor');

function init(){
	//iso.add(Shape.Prism(new Point(0, 0, 0), 4, 4, 4));
}

function tessellateDragonEggInWorld(){
	addBoxC(2, 0, 2, 14, 3, 14);
	addBoxC(1, 3, 1, 15, 7, 15);
	addBoxC(2, 7, 2, 14, 10, 14);
	addBoxC(3, 10, 3, 13, 12, 13);
	addBoxC(4, 12, 4, 12, 13, 12);
	addBoxC(5, 13, 5, 11, 14, 11);
	addBoxC(6, 14, 6, 10, 15, 10);
}

function addBoxC(x1, y1, z1, x2, y2, z2){
	var myBoxes = document.getElementById("myBoxes");
	myBoxes.innerText = myBoxes.innerText + "setRenderBounds("+x1/16+","+y1/16+","+z1/16+","+x2/16+","+y2/16+","+z2/16+");\n";
	
	if(askForColor.checked) var c = prompt("Custom Color?","255,255,255");
	var randomColor = new Color(Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255));
	if(!c){
		iso.add(Shape.extrude(new Path([
			new Point(x1/4, z1/4, y1/4),
			new Point(x2/4, z1/4, y1/4),
			new Point(x2/4, z2/4, y1/4),
			new Point(x1/4, z2/4, y1/4)
		]), (y2-y1)/4), randomColor);
	} else {
		iso.add(Shape.extrude(new Path([
			new Point(x1/4, z1/4, y1/4),
			new Point(x2/4, z1/4, y1/4),
			new Point(x2/4, z2/4, y1/4),
			new Point(x1/4, z2/4, y1/4)
		]), (y2-y1)/4), new Color(parseInt(c.split(",")[0]), parseInt(c.split(",")[1]), parseInt(c.split(",")[2])));
	}
}

function addBox(){
	var coords = prompt("Enter Coordinates [Warning: Input no spaces]","0,0,0,16,16,16");
	
	if(askForColor.checked) var c = prompt("Custom Color?","255,255,255");
	var randomColor = new Color(Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255));
	
	if(coords){
		var x1 = parseInt(coords.split(",")[0]);
		var y1 = parseInt(coords.split(",")[1]);
		var z1 = parseInt(coords.split(",")[2]);
		var x2 = parseInt(coords.split(",")[3]);
		var y2 = parseInt(coords.split(",")[4]);
		var z2 = parseInt(coords.split(",")[5]);
		
		var myBoxes = document.getElementById("myBoxes");
		myBoxes.innerText = myBoxes.innerText + "setRenderBounds("+x1/16+","+y1/16+","+z1/16+","+x2/16+","+y2/16+","+z2/16+");\n";
		if(!c){
			iso.add(Shape.extrude(new Path([
				new Point(x1/4, z1/4, y1/4),
				new Point(x2/4, z1/4, y1/4),
				new Point(x2/4, z2/4, y1/4),
				new Point(x1/4, z2/4, y1/4)
			]), (y2-y1)/4), randomColor);
		} else {
			iso.add(Shape.extrude(new Path([
				new Point(x1/4, z1/4, y1/4),
				new Point(x2/4, z1/4, y1/4),
				new Point(x2/4, z2/4, y1/4),
				new Point(x1/4, z2/4, y1/4)
			]), (y2-y1)/4), new Color(parseInt(c.split(",")[0]), parseInt(c.split(",")[1]), parseInt(c.split(",")[2])));
		}
	}
}

function setRenderBounds(){
	var coords = prompt("Enter Coordinates [Warning: Input no spaces]","0,0,0,1,1,1");
	
	if(askForColor.checked) var c = prompt("Custom Color?","255,255,255");
	var randomColor = new Color(Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255));
	
	if(coords){
		var x1 = parseFloat(coords.split(",")[0]);
		var y1 = parseFloat(coords.split(",")[1]);
		var z1 = parseFloat(coords.split(",")[2]);
		var x2 = parseFloat(coords.split(",")[3]);
		var y2 = parseFloat(coords.split(",")[4]);
		var z2 = parseFloat(coords.split(",")[5]);
		
		var myBoxes = document.getElementById("myBoxes");
		myBoxes.innerText = myBoxes.innerText + "setRenderBounds("+x1+","+y1+","+z1+","+x2+","+y2+","+z2+");\n";
		if(!c){
			iso.add(Shape.extrude(new Path([
				new Point(x1*4, z1*4, y1*4),
				new Point(x2*4, z1*4, y1*4),
				new Point(4*x2, 4*z2, 4*y1),
				new Point(4*x1, 4*z2, 4*y1)
			]), (y2-y1)*4), randomColor);
		} else {
			iso.add(Shape.extrude(new Path([
				new Point(x1*4, z1*4, y1*4),
				new Point(x2*4, z1*4, y1*4),
				new Point(x2*4, z2*4, y1*4),
				new Point(x1*4, z2*4, y1*4)
			]), (y2-y1)*4), new Color(parseInt(c.split(",")[0]), parseInt(c.split(",")[1]), parseInt(c.split(",")[2])));
		}
	}
}
