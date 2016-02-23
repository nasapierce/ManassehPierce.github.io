
$(document).ready(init);

var avatar, scene, camera, renderer, light;
function init() {
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(60, 64/96, 1, 1000);
	camera.position.set(0, 0, 3);
	camera.lookAt(scene.position);
	
	var parser = new vox.Parser();
	var parseTasks = [
		"../models/Darkserver.vox"
	].map(function(path) {
		return parser.parse(path);
	});
	Promise.all(parseTasks).then(function(voxelDataArray) {
		voxelDataArray.forEach(function(data, i) {
			var builder = new vox.MeshBuilder(data, {
				voxelSize: 1/16,
				vertexColor: true,
				optimizeFaces: false
			});
			avatar = builder.createMesh();
			avatar.position.y = -0.5;
			scene.add(avatar);
		});
	});
	
	light = new THREE.PointLight(0xFFFFFF, 1, 100);
	light.position.set(0, 5, 5);
	scene.add(light);
		
	if(Detector.webgl) renderer = new THREE.WebGLRenderer({alpha: true});
	else renderer = new THREE.CanvasRenderer({alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setClearColor(0x000000, 0);
	renderer.setSize(64, 96);
	renderer.domElement.style.zIndex = 10001; //put it above the toast
	renderer.domElement.style.position = "fixed";
	renderer.domElement.style.bottom = "0px";
	renderer.domElement.style.right = "0px";
	document.body.appendChild(renderer.domElement);
	renderer.domElement.addEventListener("click", function(e) {
		var t = Materialize.toast("Thanks for visiting my page!", 5000, "", function(){});
	});
	
	var evt = window.navigator.msPointerEnabled ? "MSPointerMove" : "touchmove";
	
	//desktop
	window.addEventListener("mousemove", function(e){
		avatar.rotation.y = ((e.clientX/2)-(window.innerWidth/2))/window.innerWidth;
	}, false);
	
	//touchscreen
	window.addEventListener(evt, function(e){
		avatar.rotation.y = ((e.touches[0].clientX/2)-(window.innerWidth/2))/window.innerWidth;
	}, false);
	
	render();
}

function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
