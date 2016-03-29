
var model = new THREE.Group();
var gui;

var settings = {
	grid: true,
	addBound: function() {
		new Bound(0, 0, 0, 1, 1, 1);
		initGUI();
	},
	exportToCPP: function() {exportToCPP();},
	exportToDemo: function() {exportToDemo();},
	controlsOpacity: 0.6
};

var demo = {
	stairs: function() {
		var bound0 = new Bound(0,0,0,1,0.5,1);
		var bound1 = new Bound(0,0.5,0,0.5,1,1);
		initGUI();
	}
};

$(document).ready(init);

var container = document.getElementById("container");
var scene, camera, renderer, light, light2, grid;
//var raycaster, mouse;
function init() {
	try {
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xDDDDDD, 0.08);
	
	camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.001, 1000);
	camera.position.set(3, 3, 3);
	camera.lookAt(scene.position);
	
	controls = new THREE.OrbitControls(camera, container);
	
	light = new THREE.PointLight(0xFFFFFF, 2, 100);
	light.position.set(2, 2.5, 3);
	scene.add(light);
	
	light2 = new THREE.PointLight(0xFFFFFF, 2, 100);
	light2.position.set(-2, -2.5, -3);
	scene.add(light2);
	
	grid = new THREE.GridHelper(10/16, 1/16);
	grid.setColors(0xFFFFFF, 0xFFFFFF);
	grid.position.y = -0.501;
	scene.add(grid);
	
	if(Detector.webgl) renderer = new THREE.WebGLRenderer();
	else renderer = new THREE.CanvasRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setClearColor(scene.fog.color);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);
	
	//raycaster = new THREE.Raycaster();
	//mouse = new THREE.Vector2();
	//document.addEventListener('mousedown', onDocumentMouseDown, false);
	//document.addEventListener('touchstart', onDocumentTouchStart, false);
	
	initGUI();
	
	scene.add(model);
	
	update();
	}catch(e){alert(e);}
}

function update() {
	requestAnimationFrame(update);
	renderer.render(scene, camera);
}

function initGUI() {
	if(gui != null) $(gui.domElement).remove();
	gui = new dat.GUI({autoPlace:false});
	
	var objectsFolder = gui.addFolder("Objects");
	var boundsFolder = objectsFolder.addFolder("Bounds");
	var exportFolder = gui.addFolder("Export");
	var demoFolder = gui.addFolder("Demos");
	
	var boundCount = 0;
	Bounds.forEach(function(bound) {
		var boundFolder = boundsFolder.addFolder("Bound " + boundCount);
		var sizeFolder = boundFolder.addFolder("Edit Size");
		var x1 = sizeFolder.add(bound, "x1").onChange(function(){bound.updateSize();});
		var y1 = sizeFolder.add(bound, "y1").onChange(function(){bound.updateSize();});
		var z1 = sizeFolder.add(bound, "z1").onChange(function(){bound.updateSize();});
		var x2 = sizeFolder.add(bound, "x2").onChange(function(){bound.updateSize();});
		var y2 = sizeFolder.add(bound, "y2").onChange(function(){bound.updateSize();});
		var z2 = sizeFolder.add(bound, "z2").onChange(function(){bound.updateSize();});
		boundFolder.add(bound, "visible").onChange(function(value) {
			if(value) bound.show();
			else bound.hide();
		});
		boundFolder.add(bound, "opacity").min(0).max(1).step(0.1).onChange(function() {
			bound.updateOpacity();
		});
		boundFolder.add(bound, "color").onChange(function() {
			bound.updateColor();
		});
		boundFolder.add(bound, "scaleBy16").onChange(function(value) {
			bound.setScaleBy16(value);
			
		});
		boundFolder.add(bound, "remove");
		
		boundCount++;
	});
	
	gui.add(settings, "controlsOpacity").min(0.1).max(1.0).step(0.1).onChange(function(value) {
		$(gui.domElement).css("opacity",value);
	});
	
	gui.add(settings, "grid").onChange(function(value) {
		if(value) scene.add(grid);
		else scene.remove(grid);
	});
	
	gui.add(settings, "addBound");
	
	exportFolder.add(settings, "exportToDemo");
	exportFolder.add(settings, "exportToCPP");
	
	demoFolder.add(demo, "stairs");
	
	gui.domElement.style.opacity = settings.controlsOpacity;
	gui.domElement.style.position = "absolute";
	gui.domElement.style.top = 0;
	gui.domElement.style.right = 0;
	document.body.appendChild(gui.domElement);	
}

/* Faces
	- edit vectors
	- edit opacity
	- edit visibility
	- terrain-atlas
	- exporting */

var Faces = [];

var Face = function(vec1, vec2, vec3, vec4) {
	this.vec1 = vec1;
	this.vec2 = vec2;
	this.vec3 = vec3;
	this.vec4 = vec4;
	this.opacity = 1.0;
	this.visible = true;
	this.geometry = new THREE.Geometry();
	this.geometry.vertices.push(vec1,vec2,vec3,vec4);
	this.face1 = new THREE.Face3(0, 1, 2);
	this.face2 = new THREE.Face3(2, 3, 0);
	this.geometry.faces.push(this.face1,this.face2);
	this.material = new THREE.MeshLambertMaterial({transparent: true});
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.position.set(-0.5,-0.5,-0.5);
	Faces.push(this);
	model.add(this.mesh);
};

Face.prototype.updateVectors = function() {
	this.geometry = new THREE.Geometry();
	this.geometry.vertices.push(vec1,vec2,vec3,vec4);
	this.face1 = new THREE.Face3(0, 1, 2);
	this.face2 = new THREE.Face3(2, 3, 0);
	this.geometry.faces.push(this.face1,this.face2);
	this.material = new THREE.MeshLambertMaterial({transparent: true});
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.position.set(-0.5,-0.5,-0.5);
};

/* Bounds 
	- terrain-atlas
	- exporting */

var Bounds = [];

var Bound = function(x1, y1, z1, x2, y2, z2) {
	this.x1 = x1;
	this.y1 = y1;
	this.z1 = z1;
	this.x2 = x2;
	this.y2 = y2;
	this.z2 = z2;
	this.width = x2 - x1;
	this.height = y2 - y1;
	this.depth = z2 - z1;
	this.opacity = 1.0;
	this.visible = true;
	this.color = "#ffffff";
	this.scaleBy16 = false;
	this.geometry = new THREE.CubeGeometry(this.width, this.height, this.depth, 1, 1, 1);
	this.material = new THREE.MeshLambertMaterial({transparent: true});
	this.material.color = new THREE.Color().setStyle(this.color);
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.position.set((this.width/2) + this.x1 - 0.5, (this.height/2) + this.y1 - 0.5, (this.depth/2) + this.z1 - 0.5);
	model.add(this.mesh);
	Bounds.push(this);
};

Bound.prototype.setScaleBy16 = function(bool) {
	if(bool) {
		this.x1 = this.x1 * 16;
		this.y1 = this.y1 * 16;
		this.z1 = this.z1 * 16;
		this.x2 = this.x2 * 16;
		this.y2 = this.y2 * 16;
		this.z2 = this.z2 * 16;
	} else {
		this.x1 = this.x1 / 16;
		this.y1 = this.y1 / 16;
		this.z1 = this.z1 / 16;
		this.x2 = this.x2 / 16;
		this.y2 = this.y2 / 16;
		this.z2 = this.z2 / 16;
	}
};

Bound.prototype.updateSize = function() {
	if(!this.scaleBy16) {
		this.width = this.x2 - this.x1;
		this.height = this.y2 - this.y1;
		this.depth = this.z2 - this.z1;
		this.geometry = new THREE.CubeGeometry(this.width, this.height, this.depth, 1, 1, 1);
		this.mesh.geometry = this.geometry;
		this.mesh.position.set((this.width/2) + this.x1 - 0.5, (this.height/2) + this.y1 - 0.5, (this.depth/2) + this.z1 - 0.5);
	} else {
		this.width = (this.x2 - this.x1)/16;
		this.height = (this.y2 - this.y1)/16;
		this.depth = (this.z2 - this.z1)/16;
		this.geometry = new THREE.CubeGeometry(this.width, this.height, this.depth, 1, 1, 1);
		this.mesh.geometry = this.geometry;
		this.mesh.position.set((this.width/2) + this.x1 - 0.5, (this.height/2) + this.y1 - 0.5, (this.depth/2) + this.z1 - 0.5);
	}
};

Bound.prototype.hide = function() {
	model.remove(this.mesh);
};

Bound.prototype.show = function() {
	model.add(this.mesh);
};

Bound.prototype.updateOpacity = function() {
	this.mesh.material.opacity = this.opacity;
};

Bound.prototype.updateColor = function() {
	this.mesh.material.color = new THREE.Color().setStyle(this.color);
};

Bound.prototype.remove = function() {
	model.remove(this.mesh);
	Bounds.splice(Bounds.indexOf(this), 1);
	initGUI();
};

function exportToDemo() {
	var isOkayToNotExportHidden = confirm("All non-visible bounds will not get exported. Continue?");
	if(!isOkayToNotExportHidden) return;
	
	var name =  prompt("What do you want to name this Demo?");
	if(!name) return;
	
	var JSLines = [name+": function() {"];
	var boundLength = 0;
	Bounds.forEach(function(bound) {
		JSLines.push("var bound"+boundLength+" = new Bound("+bound.x1+","+bound.y1+","+bound.z1+","+bound.x2+","+bound.y2+","+bound.z2+");");
		if(bound.opacity != 1.0) JSLines.push("bound"+boundLength+".opacity = "+bound.opacity+";");
		boundLength++;
	});
	JSLines.push("initGUI();","}");
	
	download("demo_"+name+".js", JSLines.join("\n"));
}

function exportToCPP() {
	var isOkayToNotExportHidden = confirm("All non-visible bounds will not get exported. Continue?");
	if(!isOkayToNotExportHidden) return;
	
	var name =  prompt("What do you want to name this Model?");
	if(!name) return;
	
	var file = ["#include \"BlockTessellator.h\"","","//Put in BlockTessellator.h","//bool tessellate"+name+"InWorld(Block* block, BlockPos const& pos);","","BlockTessellator::tessellate"+name+"InWorld(Block* block, BlockPos const& pos) {"];
	Bounds.forEach(function(bound) {
		file.push("setRenderBounds("+bound.x1.toFixed(1)+","+bound.y1.toFixed(1)+","+bound.z1.toFixed(1)+","+bound.x2.toFixed(1)+","+bound.y2.toFixed(1)+","+bound.z2.toFixed(1)+");","tessellateBlockInWorld(*block, pos);","");
	});
	
	file.push("}");
	
	download(name+".cpp", file.join("\n"));
}

function download(filename, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}
