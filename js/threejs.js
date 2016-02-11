var container = document.getElementById("container");
var scene, camera, controls, renderer, projector;
var grid, light, ambeintLight;
var test;

$(document).ready(function(){
	init();
});

function init() {
	
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xDDDDDD, 0.008);
	
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.001, 1000);
	camera.position.set(5, 5, 5);
	
	controls = new THREE.OrbitControls(camera, container);
	
	var r = new THREE.Raycaster(new THREE.Vector3(0, 0.25, -1).normalize(), new THREE.Vector3(0, 0.25, 1).normalize());
	
	var p1s = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), new THREE.MeshLambertMaterial({color: 0xff0000}));
	p1s.position.set(0, 0.25, -1).normalize();
	p1s.updateMatrix();
	//scene.add(p1s);
	
	var p2s = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), new THREE.MeshLambertMaterial({color: 0xff0000}));
	p2s.position.set(0, 0.25, 1).normalize();
	p2s.updateMatrix();
	//scene.add(p2s);
	
	var icon = THREE.ImageUtils.loadTexture("images/icon.png");
	icon.magFilter = THREE.NearestFilter;
	icon.minFilter = THREE.LinearMipMapLinearFilter;
	
	test = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({map:icon, transparent:true, side:THREE.DoubleSide}));
	test.position.set(0, 1, 0);
	test.updateMatrix();
	scene.add(test);
	
	var coord = {x:0, y:1, z:0};
	var tween = new TWEEN.Tween(coord);
	tween.to({x:0, y:1.5, z:0}, 2000);
	tween.onUpdate(function(){
		test.position.set(this.x, this.y, this.z);
	});
	tween.start();
	
	var intersects = r.intersectObjects(scene.children);
	for (var i=0;i<intersects.length;i++) {
		//intersects[i].object.material = new THREE.MeshNormalMaterial();
	}
	//alert(intersects.length);
	
	light = new THREE.DirectionalLight(0xdddddd, 1);
	light.position.set(5, 5, 5).normalize();
	scene.add(light);
	
	ambientLight = new THREE.AmbientLight(0xcccccc);
	scene.add(ambientLight);
	
	grid = new THREE.GridHelper(7.5, 1);
	grid.setColors(0xffffff, 0xffffff);
	scene.add(grid);
	
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(scene.fog.color);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);
	
	update();
}

var rot = 0;

function update() {
	requestAnimationFrame(update);
	rot += 0.01;
	test.rotation.y = rot;
	TWEEN.update();
	render();
}

function render() {
	renderer.render(scene, camera);
}
