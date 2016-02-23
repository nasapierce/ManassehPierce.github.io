var container = document.getElementById("container");
var scene, camera, controls, renderer, projector;
var grid, light, ambeintLight;
var stage, queue;

$(document).ready(load);

function load() {
	queue = new createjs.LoadQueue();
	queue.on("complete", queueComplete, this);
	//queue.on("fileload", queueFileload, this);
	queue.loadManifest([
		{id: "gore", src: "images/InventoryButtonBackground.png"}
	]);
}



function queueComplete() {
	init();
}

function init() {
	var canvas = document.createElement("CANVAS");
	var stage = new createjs.Stage(canvas);
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xDDDDDD, 0.008);
	
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.001, 1000);
	camera.position.set(5, 5, 5);
	
	controls = new THREE.OrbitControls(camera, container);
	
	light = new THREE.DirectionalLight(0xDDDDDD, 1);
	light.position.set(5, 5, 5).normalize();
	scene.add(light);
	
	ambientLight = new THREE.AmbientLight(0xDDDDDD);
	scene.add(ambientLight);
	
	grid = new THREE.GridHelper(7.5, 1);
	grid.setColors(0xffffff, 0xffffff);
	scene.add(grid);
	
	if(Detector.webgl) renderer = new THREE.WebGLRenderer({antialias:true});
	if(!Detector.webgl) renderer = new THREE.CanvasRenderer();
	renderer.setClearColor(scene.fog.color);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);
	
	var gore = queue.getResult("gore");
	canvas.width = gore.width;
	canvas.height = gore.height;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(gore, 0, 0, gore.width, gore.height);
	var g = new THREE.CanvasGeometry(canvas, 2/gore.width, true, new THREE.MeshLambertMaterial({vertexColors: THREE.FaceColors}));
	var m = new THREE.Mesh(g, new THREE.MeshFaceMaterial(g.materials));
	m.position.x = -0.5;
	m.position.y = 1;
	scene.add(m);
	
	update();
}

function update() {
	requestAnimationFrame(update);
	renderer.render(scene, camera);
}

/* I made this so I wouldn't have to type out 3 lines to set a faces vertices */
THREE.Face3.prototype.set = function(a, b, c) {
	this.a = a;
	this.b = b;
	this.c = c;
};

/* Obviously this will not be good for larger images.
   If you want larger Images, google: THREEJS Image Triangulation and Extrusion
   parameters:
   		canvas - <CANVAS DOM Element>
		depth - how far to extend the Image
		hasOpacity - If the canvas has opacity
   		material - The material to use on the geometry with THREE.MeshFaceMaterial();
   To use opacity:
   		set hasOpacity to true,
		set a material to use with transparency
		set the Mesh material to THREE.MeshFaceMaterial(yourCanvasGeometry.materials());
	*/
THREE.CanvasGeometry = function (canvas, depth, hasOpacity, material) {
	THREE.Geometry.call( this );
	var ctx = canvas.getContext('2d'),
		w = canvas.width, 
		h = canvas.height;
	this.materials = [];
	this.opacitys = [];
	for(var x=0;x<w;x++) {
		for(var y=0;y<h;y++) {
			var data = ctx.getImageData(x, y, x+1, y+1).data;
			if(data[3] !== 0) {
				var vectors = [];
				var v = new THREE.Vector3();
				var f = new THREE.Face3();
				f.color.setStyle("rgb("+data[0]+","+data[1]+","+data[2]+")");
				if(hasOpacity) {
					if(this.opacitys.indexOf(data[3]/255) == -1) {
						this.opacitys.push(data[3]/255);
						var materialClone = material.clone();
						materialClone.transparent = true;
						materialClone.opacity = data[3]/255;
						this.materials.push(materialClone);
					}
					f.materialIndex = this.opacitys.indexOf(data[3]/255);
				}
				v.set(x/w, -y/w, 0);
				this.vertices.push(v.clone());
				vectors.push(this.vertices.length-1);
				
				v.set((x+1)/w, -y/w, 0);
				this.vertices.push(v.clone());
				vectors.push(this.vertices.length-1);
				
				v.set((x+1)/w, (-y+1)/w, 0);
				this.vertices.push(v.clone());
				vectors.push(this.vertices.length-1);
				
				v.set(x/w, (-y+1)/w, 0);
				this.vertices.push(v.clone());
				vectors.push(this.vertices.length-1);
				
				v.set(x/w, -y/w, depth);
				this.vertices.push(v.clone());
				vectors.push(this.vertices.length-1);
				
				v.set((x+1)/w, -y/w, depth);
				this.vertices.push(v.clone());
				vectors.push(this.vertices.length-1);
				
				v.set((x+1)/w, (-y+1)/w, depth);
				this.vertices.push(v.clone());
				vectors.push(this.vertices.length-1);
				
				v.set(x/w, (-y+1)/w, depth);
				this.vertices.push(v.clone());
				vectors.push(this.vertices.length-1);
				
				f.set(vectors[2], vectors[1], vectors[0]);
				this.faces.push(f.clone());
				
				f.set(vectors[0], vectors[3], vectors[2]);
				this.faces.push(f.clone());
				
				f.set(vectors[4], vectors[5], vectors[6]);
				this.faces.push(f.clone());
				
				f.set(vectors[6], vectors[7], vectors[4]);
				this.faces.push(f.clone());
				
				//check left
				if(x-1 < 0 || ctx.getImageData(x-1, y, x, y+1).data[3] == 0) {
					vectors = [];
					v.set(x/w, -y/w, 0);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set(x/w, (-y+1)/w, 0);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set(x/w, (-y+1)/w, depth);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set(x/w, -y/w, depth);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					f.set(vectors[2], vectors[1], vectors[0]);
					this.faces.push(f.clone());
					f.set(vectors[0], vectors[3], vectors[2]);
					this.faces.push(f.clone());
				}
				// check right
				if(x+1 > w || ctx.getImageData(x+1, y, x+2, y+1).data[3] == 0) {
					vectors = [];
					v.set((x+1)/w, -y/w, 0);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set((x+1)/w, (-y+1)/w, 0);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set((x+1)/w, (-y+1)/w, depth);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set((x+1)/w, -y/w, depth);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					f.set(vectors[0], vectors[1], vectors[2]);
					this.faces.push(f.clone());
					f.set(vectors[2], vectors[3], vectors[0]);
					this.faces.push(f.clone());
				}
				//check top
				if(y+1 > h || ctx.getImageData(x, y+1, x+1, y+2).data[3] == 0) {
					vectors = [];
					v.set(x/w, (-y)/w, 0);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set((x+1)/w, (-y)/w, 0);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set((x+1)/w, (-y)/w, depth);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set(x/w, (-y)/w, depth);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					f.set(vectors[0], vectors[1], vectors[2]);
					this.faces.push(f.clone());
					f.set(vectors[2], vectors[3], vectors[0]);
					this.faces.push(f.clone());
				}
				//check bottom
				if(y-1 < 0 || ctx.getImageData(x, y-1, x+1, y).data[3] == 0) {
					vectors = [];
					v.set(x/w, (-y+1)/w, 0);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set((x+1)/w, (-y+1)/w, 0);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set((x+1)/w, (-y+1)/w, depth);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set(x/w, (-y+1)/w, depth);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					f.set(vectors[0], vectors[3], vectors[2]);
					this.faces.push(f.clone());
					f.set(vectors[2], vectors[1], vectors[0]);
					this.faces.push(f.clone());
				}
			}
		}
	}
	
	this.mergeVertices();
	this.computeFaceNormals();
	this.computeVertexNormals();
};

THREE.CanvasGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.CanvasGeometry.prototype.constructor = THREE.CanvasGeometry;

