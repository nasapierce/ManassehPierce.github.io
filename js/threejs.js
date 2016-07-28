var container = document.getElementById("container");
var canvas = document.getElementById("canv");
var ctx = canvas.getContext("2d");
var scene, camera, controls, renderer, projector;
var grid, light, ambeintLight;
var info = document.getElementById("info");
var widthToHeight = 256/192, newWidth, newHeight, newWidthToHeight;

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

function init() {
	window.addEventListener("resize", resizeGame, false);
	resizeGame();
	
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xDDDDDD, 0.008);
	
	camera = new THREE.PerspectiveCamera(60, newWidth / newHeight, 0.001, 1000);
	camera.position.set(5, 5, 5);
	camera.lookAt(new THREE.Vector3(0.05, 0.37, 0));
	
	controls = new THREE.OrbitControls(camera, container);
	
	light = new THREE.DirectionalLight(0xDDDDDD, 1);
	light.position.set(5, 5, 5).normalize();
	scene.add(light);
	
	ambientLight = new THREE.AmbientLight(0xDDDDDD);
	scene.add(ambientLight);
	
	grid = new THREE.GridHelper(7.5, 1);
	grid.setColors(0x484848, 0x484848);
	scene.add(grid);
	
	if(Detector.webgl) renderer = new THREE.WebGLRenderer({antialias:true, alpha: true});
	if(!Detector.webgl) renderer = new THREE.CanvasRenderer();
	renderer.setClearColor(0xffffff);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(newWidth, newHeight);
	renderer.domElement.id = "renderer";
	container.appendChild(renderer.domElement);
	
	update();
}

function update() {
	requestAnimationFrame(update);
	if(parseInt(renderer.domElement.style.width.split("px")[0]) !== newWidth) {
		renderer.setSize(newWidth, newHeight);
		camera.ratio = newWidth / newHeight;
		camera.updateProjectionMatrix();
	}
	renderer.render(scene, camera);
}

init();
