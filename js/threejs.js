var container = document.getElementById("container");
var scene, camera, controls, renderer, projector;
var grid, light, ambeintLight;
var images = {};

$(document).ready(init);

function init() {
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
	
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setClearColor(scene.fog.color);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);
	
	var img = document.createElement("IMG");
	img.src = "images/terrariaItems/item_tizona.png";
	img.onload = function() {
		var canvas = document.createElement("CANVAS");
		canvas.width = this.width;
		canvas.height = this.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(this, 0, 0, this.width, this.height);
		var g = new THREE.CanvasGeometry(canvas, 2/canvas.width);
		var m = new THREE.Mesh(g, new THREE.MeshLambertMaterial({side: THREE.FrontSide, vertexColors: THREE.FaceColors}));
		m.rotation.z = Math.PI/2;
		m.position.x = 0.5;
		scene.add(m);
	};
	
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
   NOTE: The y-axis is flipped on this, I am too lazy to rewrite this so just rotate the mesh you add this to*/
THREE.CanvasGeometry = function (canvas, depth) {
	THREE.Geometry.call( this );
	var ctx = canvas.getContext('2d'),
		w = canvas.width, 
		h = canvas.height;
	for(var x=0;x<w;x++) {
		for(var y=0;y<h;y++) {
			var data = ctx.getImageData(x, y, x+1, y+1).data;
			if(data[3] !== 0) {
				var vectors = [];
				var v = new THREE.Vector3();
				var f = new THREE.Face3();
				f.color.setStyle("rgb("+data[0]+","+data[1]+","+data[2]+")");
				v.set(x/w, y/w, 0);
				this.vertices.push(v.clone());
				vectors.push(this.vertices.length-1);
				
				v.set((x+1)/w, y/w, 0);
				this.vertices.push(v.clone());
				vectors.push(this.vertices.length-1);
				
				v.set((x+1)/w, (y+1)/w, 0);
				this.vertices.push(v.clone());
				vectors.push(this.vertices.length-1);
				
				v.set(x/w, (y+1)/w, 0);
				this.vertices.push(v.clone());
				vectors.push(this.vertices.length-1);
				
				v.set(x/w, y/w, depth);
				this.vertices.push(v.clone());
				vectors.push(this.vertices.length-1);
				
				v.set((x+1)/w, y/w, depth);
				this.vertices.push(v.clone());
				vectors.push(this.vertices.length-1);
				
				v.set((x+1)/w, (y+1)/w, depth);
				this.vertices.push(v.clone());
				vectors.push(this.vertices.length-1);
				
				v.set(x/w, (y+1)/w, depth);
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
					v.set(x/w, y/w, 0);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set(x/w, (y+1)/w, 0);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set(x/w, (y+1)/w, depth);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set(x/w, y/w, depth);
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
					v.set((x+1)/w, y/w, 0);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set((x+1)/w, (y+1)/w, 0);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set((x+1)/w, (y+1)/w, depth);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set((x+1)/w, y/w, depth);
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
					v.set(x/w, (y+1)/w, 0);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set((x+1)/w, (y+1)/w, 0);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set((x+1)/w, (y+1)/w, depth);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set(x/w, (y+1)/w, depth);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					f.set(vectors[0], vectors[3], vectors[2]);
					this.faces.push(f.clone());
					f.set(vectors[2], vectors[1], vectors[0]);
					this.faces.push(f.clone());
				}
				//check bottom
				if(y-1 < 0 || ctx.getImageData(x, y-1, x+1, y).data[3] == 0) {
					vectors = [];
					v.set(x/w, y/w, 0);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set((x+1)/w, y/w, 0);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set((x+1)/w, y/w, depth);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					v.set(x/w, y/w, depth);
					this.vertices.push(v.clone());
					vectors.push(this.vertices.length-1);
					
					f.set(vectors[0], vectors[1], vectors[2]);
					this.faces.push(f.clone());
					f.set(vectors[2], vectors[3], vectors[0]);
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

