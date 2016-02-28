var container = document.getElementById("container");
var scene, camera, renderer;
var grid, light, ambeintLight;

$(document).ready(init);

function init() {
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.001, 1000);
	camera.position.set(5, 5, 5);
	
	light = new THREE.DirectionalLight(0xDDDDDD, 1);
	light.position.set(5, 5, 5).normalize();
	scene.add(light);
	
	ambientLight = new THREE.AmbientLight(0xDDDDDD);
	scene.add(ambientLight);
	
	grid = new THREE.GridHelper(7.5, 1);
	grid.setColors(0x000000, 0x000000);
	scene.add(grid);
	
	renderer = new THREE.WebGLRenderer({alpha:true});
	renderer.setClearColor(0x000000, 0);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);
	
	update();
}

function update() {
	requestAnimationFrame(update);
	renderer.render(scene, camera);
}

