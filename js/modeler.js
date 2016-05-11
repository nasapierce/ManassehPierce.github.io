var model = new THREE.Group();
var gui, textureNames = [];

var TGALoader = new THREE.TGALoader();
var terrain_atlas = TGALoader.load("images/terrain-atlas.tga", function(tex) {
	tex.magFilter = THREE.NearestFilter;
	tex.minFilter = THREE.LinearMipMapLinearFilter;
});

/* setup texture names from terrain.js */
for(var i in terrain_meta) {
	for(var uvs = 0;uvs<terrain_meta[i].uvs.length;uvs++) {
		textureNames.push(terrain_meta[i].name + "_" + uvs);
	}
}

var settings = {
	grid: true,
	addBound: function() {
		new Bound(0, 0, 0, 1, 1, 1);
		initGUI(); /* I wish dat.gui would dynamically update folders and such */
	},
	exportToCPP: exportToCPP,
	exportToDemo: exportToDemo,
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
var scene, camera, renderer, light, ambeintLight, grid;

function init() {
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xDDDDDD, 0.08);
	
	camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.001, 1000);
	camera.position.set(3, 3, 3);
	camera.lookAt(scene.position);
	
	controls = new THREE.OrbitControls(camera, container);
	
	light = new THREE.DirectionalLight(0xFFFFFF, 2, 100);
	light.position.set(1, 3, 2);
	scene.add(light);
	
	ambientLight = new THREE.AmbientLight(0xCCCCCC);
	scene.add(ambeintLight);
	
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
	
	initGUI();
	
	scene.add(model);
	
	update();
}

function update() {
	requestAnimationFrame(update);
	renderer.render(scene, camera);
}

/* object Folder Open ect. */
var oFO, bFO, eFO, dFO;
oFO = bFO = eFO = dFO = false;

function initGUI() {
	if(gui != null) $(gui.domElement).remove();
	gui = new dat.GUI({autoPlace:false});
	
	var objectsFolder = gui.addFolder("Objects");
	$(objectsFolder.domElement).click(function(){oFO=!oFO;});
	
	var boundsFolder = objectsFolder.addFolder("Bounds");
	$(boundsFolder.domElement).click(function(){bFO=!bFO;});
	
	var exportFolder = gui.addFolder("Export");
	$(exportFolder.domElement).click(function(){eFO=!eFO;});
	
	var demoFolder = gui.addFolder("Demos");
	$(demoFolder.domElement).click(function(){dFO=!dFO;});
	
	if(oFO) objectsFolder.open();
	if(bFO) objectsFolder.open(); boundsFolder.open();
	if(eFO) exportFolder.open();
	if(dFO) demoFolder.open();
	
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
		boundFolder.add(bound, "texture", textureNames).onChange(function() {
			bound.updateTexture();
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
	this.texture = "planks_0";
	this.geometry = new THREE.CubeGeometry(this.width, this.height, this.depth, 1, 1, 1);
	this.material = new THREE.MeshLambertMaterial({map: terrain_atlas, transparent: true, color: 0xffffff, side: THREE.FrontSide});
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.position.set((this.width/2) + this.x1 - 0.5, (this.height/2) + this.y1 - 0.5, (this.depth/2) + this.z1 - 0.5);
	model.add(this.mesh);
	Bounds.push(this);
	this.updateTexture();
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

Bound.prototype.remove = function() {
	model.remove(this.mesh);
	Bounds.splice(Bounds.indexOf(this), 1);
	initGUI();
};

Bound.prototype.updateTexture = function() {
	//get texture obj by name
	var textureUVS;
	for(var i in terrain_meta) {
		if(terrain_meta[i].name == this.texture.substring(0, this.texture.lastIndexOf("_") ) ) {
			textureUVS = terrain_meta[i].uvs[parseInt(this.texture.substring(this.texture.lastIndexOf("_") + 1, this.texture.length))];
		}
	}
	var UVS = [
		new THREE.Vector2(textureUVS[0] / textureUVS[4], (256-textureUVS[3]) / textureUVS[5]),
		new THREE.Vector2(textureUVS[0] / textureUVS[4], (256-textureUVS[1]) / textureUVS[5]),
		new THREE.Vector2(textureUVS[2] / textureUVS[4], (256-textureUVS[1]) / textureUVS[5]),
		new THREE.Vector2(textureUVS[2] / textureUVS[4], (256-textureUVS[3]) / textureUVS[5])
	];
	//set faces
	this.geometry.faceVertexUvs[0] = [];
	this.geometry.faceVertexUvs[0][8] = [UVS[0], UVS[1], UVS[3]];
	this.geometry.faceVertexUvs[0][9] = [UVS[1], UVS[2], UVS[3]];
	this.geometry.faceVertexUvs[0][4] = [UVS[0], UVS[1], UVS[3]];
	this.geometry.faceVertexUvs[0][5] = [UVS[1], UVS[2], UVS[3]];
	this.geometry.faceVertexUvs[0][2] = [UVS[0], UVS[1], UVS[3]];
	this.geometry.faceVertexUvs[0][3] = [UVS[1], UVS[2], UVS[3]];
	this.geometry.faceVertexUvs[0][0] = [UVS[0], UVS[1], UVS[3]];
	this.geometry.faceVertexUvs[0][1] = [UVS[1], UVS[2], UVS[3]];
	this.geometry.faceVertexUvs[0][10] = [UVS[0], UVS[1], UVS[3]];
	this.geometry.faceVertexUvs[0][11] = [UVS[1], UVS[2], UVS[3]];
	this.geometry.faceVertexUvs[0][6] = [UVS[0], UVS[1], UVS[3]];
	this.geometry.faceVertexUvs[0][7] = [UVS[1], UVS[2], UVS[3]];
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
	
	var file = ["#include \"BlockTessellator.h\"","","//Put in BlockTessellator.h, make sure its uncommented.","//bool tessellate"+name+"InWorld(Block* block, BlockPos const& pos);","","//the set method is for the AABB Instance in BlockTessellator. If yours is named different retype all 'aabb.set'(s) to be correct.","","BlockTessellator::tessellate"+name+"InWorld(Block* block, BlockPos const& pos) {"];
	Bounds.forEach(function(bound) {
		file.push("aabb.set("+bound.x1.toFixed(1)+","+bound.y1.toFixed(1)+","+bound.z1.toFixed(1)+","+bound.x2.toFixed(1)+","+bound.y2.toFixed(1)+","+bound.z2.toFixed(1)+");","tessellateBlockInWorld(*block, pos);","");
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
