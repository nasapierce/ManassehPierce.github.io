var container = document.getElementById("container");
var scene, camera, controls, renderer, projector;
var grid, light, ambeintLight;
var stage, queue;
var info = document.getElementById("info");
var widthToHeight = 256/192, newWidth, newHeight, newWidthToHeight;

$(document).ready(load);

function load() {
	queue = new createjs.LoadQueue();
	queue.on("complete", queueComplete, this);
	queue.loadManifest([
		{id: "fox", src: "images/low_poly_fox.png"}
	]);
}

function resizeGame() {
	newWidth = window.innerWidth;
	newHeight = window.innerHeight;
	newWidthToHeight = newWidth / newHeight;
	if(newWidthToHeight > widthToHeight) {
		newWidth = newHeight * widthToHeight;
	} else {
		newHeight = newWidth / widthToHeight;
	}
	container.style.height = newHeight + 'px';
	container.style.width = newWidth + 'px';
	container.style.marginTop = (-newHeight / 2) + 'px';
	container.style.marginLeft = (-newWidth / 2) + 'px';
	var canvas = document.getElementById("canv");
	canvas.width = newWidth;
	canvas.height = newHeight;
}

function queueComplete() {
	window.addEventListener("resize", resizeGame, false);
	resizeGame();
	init();
}

function init() {
	var stage = new createjs.Stage(document.getElementById("canv"));
	
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xDDDDDD, 0.008);
	
	camera = new THREE.PerspectiveCamera(60, newWidth / newHeight, 0.001, 1000);
	camera.position.set(0.58, 0.86, -0.95);
	camera.lookAt(new THREE.Vector3(0.05, 0.37, 0));
	
	//controls = new THREE.OrbitControls(camera, container);
	
	light = new THREE.DirectionalLight(0xDDDDDD, 1);
	light.position.set(5, 5, 5).normalize();
	scene.add(light);
	
	ambientLight = new THREE.AmbientLight(0xDDDDDD);
	scene.add(ambientLight);
	
	grid = new THREE.GridHelper(7.5, 1);
	grid.setColors(0xffffff, 0xffffff);
	scene.add(grid);
	
	if(Detector.webgl) renderer = new THREE.WebGLRenderer({antialias:true, alpha: true});
	if(!Detector.webgl) renderer = new THREE.CanvasRenderer();
	renderer.setClearColor(0x000000, 0);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(newWidth, newHeight);
	renderer.domElement.id = "renderer";
	container.appendChild(renderer.domElement);
	
	//var img = new createjs.Bitmap(queue.getResult("fox"));
	//img.scaleX = newWidth / 256;
	//img.scaleY = newHeight / 192;
	
	//stage.addChild(img);
	//stage.update();
	
	var b = new Base();
	var mtl = new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 1});
	var m = new THREE.Mesh(b, mtl);
	m.scale.set(1/10, 1/10, 1/10);
	m.position.set(-0.5, 0, -0.5);
	m.updateMatrix();
	scene.add(m);
	
	var edg = new THREE.EdgesHelper(m, 1, 0x000000);
	scene.add(edg);
	
	update();
}

function update() {
	requestAnimationFrame(update);
	if(parseInt(renderer.domElement.style.width.split("px")[0]) !== newWidth) {
		renderer.setSize(newWidth, newHeight);
		camera.ratio = newWidth / newHeight;
		camera.updateProjectionMatrix();
	}
	info.innerHTML = ["x: " + camera.position.x, "y: " + camera.position.y, "z: " + camera.position.z].join("<br/>");
	renderer.render(scene, camera);
}

var Base = function () {
	
	var scope = this;

	THREE.Geometry.call( this );
	/* body bottom */
	v( 2.5, 0.75, 4.0 ); // 0
	v( 2.5, 0.75, 6.0 ); // 1
	v( 5.0, 0.75, 7.5 ); // 2
	v( 7.5, 0.75, 6.0 ); // 3
	v( 7.5, 0.75, 4.0 ); // 4
	v( 5.0, 0.75, 2.5 ); // 5
	
	/* body top */
	v( 3.5, 3.75, 4.5 ); // 6
	v( 3.5, 3.75, 5.5 ); // 7
	v( 5.0, 3.75, 6.5 ); // 8
	v( 6.5, 3.75, 5.5 ); // 9
	v( 6.5, 3.75, 4.5 ); // 10
	v( 5.0, 3.75, 3.5 ); // 11
	
	/* right foot */
	v( 5.5, 0.0, 5.75 ); // 12
	v( 7.25, 0.0, 5.75 ); // 13
	v( 7.25, 0.0, 3.0 ); // 14
	v( 6.0, 0.0, 3.0 ); // 15
	v( 5.5, 1.0, 5.5 ); // 16
	v( 7.0, 1.0, 5.5 ); // 17
	
	/* left foot */
	v( 2.75, 0.0, 5.75 ); // 18
	v( 4.5, 0.0, 5.5 ); // 19
	v( 4.1, 0.0, 3.0 ); // 20
	v( 2.75, 0.0, 3.0 ); // 21
	v( 3.0, 1.0, 5.5 ); // 22
	v( 4.5, 1.0, 5.5 ); // 23
	
	/* right arm */
	v( 7.5, 2.0, 5.0 ); // 24
	v( 6.5, 3.5, 4.5 ); // 25
	v( 6.5, 3.5, 5.5 ); // 26
	
	/* left arm */
	v( 2.5, 2.0, 5.0 ); // 27
	v( 3.5, 3.5, 4.5 ); // 28
	v( 3.5, 3.5, 5.5 ); // 29
	
	/* head bottom */
	v( 3.0, 3.75, 4.0 ); // 30
	v( 3.0, 3.75, 6.0 ); // 31
	v( 5.0, 3.75, 7.25 ); // 32
	v( 7.0, 3.75, 6.0 ); // 33
	v( 7.0, 3.75, 4.0 ); // 34
	v( 5.0, 3.75, 2.75 ); // 35
	
	/* head top */
	v( 3.0, 5.75, 4.0 ); // 36
	v( 3.0, 5.75, 6.0 ); // 37
	v( 5.0, 5.75, 7.25 ); // 38
	v( 7.0, 5.75, 6.0 ); // 39
	v( 7.0, 5.75, 4.0 ); // 40
	v( 5.0, 5.75, 2.75 ); // 41
	
	/* head top point */
	v( 5.0, 7.25, 5.0 ); // 42
	
	/* body bottom */
	f3( 1, 0, 5 );
	f3( 2, 1, 5);
	f3( 3, 2, 5 );
	f3( 4, 3, 5 );
	
	/* body top */
	f3( 6, 7, 11 );
	f3( 7, 8, 11 );
	f3( 8, 9, 11 );
	f3( 9, 10, 11 );
	
	/* body bottom to top */
	f3( 0, 1, 7 );
	f3( 0, 7, 6);
	f3( 3, 4, 10 );
	f3( 3, 10, 9);
	f3( 1, 2, 8 );
	f3( 1, 8, 7);
	f3( 2, 3, 8 );
	f3( 3, 9, 8);
	f3( 0, 11, 5);
	f3( 0, 6, 11 );
	f3( 4, 5, 11 );
	f3( 4, 11, 10 );
	
	/* right foot */
	f3( 12, 14, 13 );
	f3( 12, 15, 14 );
	f3( 15, 16, 17 );
	f3( 17, 14, 15 );
	f3( 16, 15, 12 );
	f3( 17, 13, 14 );
	f3( 13, 16, 12 );
	f3( 17, 16, 13 );
	
	/* left foot */
	f3( 18, 20, 19 );
	f3( 18, 21, 20 );
	f3( 21, 22, 23 );
	f3( 23, 20, 21 );
	f3( 22, 21, 18 );
	f3( 23, 19, 20 );
	f3( 19, 22, 18 );
	f3( 23, 22, 19 );
	
	/* right arm */
	f3( 24, 25, 26 );
	
	/* left arm */
	f3( 27, 29, 28 );
	
	/* head bottom */
	f3( 31, 30, 35 );
	f3( 32, 31, 35);
	f3( 33, 32, 35 );
	f3( 34, 33, 35 );
	
	/* head bottom to top */
	f3( 30, 31, 36 );
	f3( 31, 37, 36 );
	f3( 31, 32, 37 );
	f3( 32, 38, 37 );
	f3( 32, 33, 38 );
	f3( 33, 39, 38 );
	f3( 33, 34, 39 );
	f3( 34, 40, 39 );
	f3( 34, 35, 40);
	f3( 35, 41, 40 );
	f3( 35, 36, 41 );
	f3( 35, 30, 36 );
	
	/* head top */
	f3( 36, 37, 42 );
	f3( 37, 38, 42 );
	f3( 38, 39, 42 );
	f3( 39, 40, 42 );
	f3( 40, 41, 42 );
	f3( 41, 36, 42 );
	
	
	this.computeFaceNormals();

	function v( x, y, z ) {
		scope.vertices.push( new THREE.Vector3( x, y, z ) );
	}

	function f3( a, b, c ) {
		scope.faces.push( new THREE.Face3( a, b, c ) );
	}

};

Base.prototype = Object.create( THREE.Geometry.prototype );
Base.prototype.constructor = Base;

