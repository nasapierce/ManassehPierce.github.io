
try {
	var avatar, scene, camera, renderer, light;
	function init() {
		scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0xDDDDDD, 1, 1000);
		
		camera = new THREE.PerspectiveCamera(60, 64 / 128, 1, 1000);
		camera.position.set(0,0,3);
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
					//vertexColor: true,
					optimizeFaces: false
				});
				avatar = builder.createMesh();
				avatar.position.y = -0.5;
				scene.add(avatar);
			});
		});
		
		light = new THREE.PointLight(0xdddddd, 1, 100);
		light.position.set(3, 3, 3);
		scene.add(light);
	
		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setClearColor(scene.fog.color);
		renderer.setSize(64, 128);
		renderer.domElement.style.zIndex = 100;
		renderer.domElement.style.position = "fixed";
		renderer.domElement.style.top = "0px";
		renderer.domElement.style.left = "0px";
		
		document.body.appendChild(renderer.domElement);
		render();
	}
	function render() {
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}
	init();
} catch(e) {
	alert(e);
}
