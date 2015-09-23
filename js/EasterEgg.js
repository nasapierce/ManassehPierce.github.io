
var THREE = THREE;
var TileTessellator;

$(document).ready(function(){
	if(Detector.webgl){
		TileTessellator = new EngineRenderer(document.body, false, false, false);
		TileTessellator.init();
		TileTessellator.render();
		TileTessellator.objLoader.load('assets/object/Elucidator/Elucidator.obj', function(object){
			var material = new THREE.MeshPhongMaterial({map: TileTessellator.tgaLoader.load('assets/object/Elucidator/Elucidator_spec.tga'), specular: 0x111111, shininess: 100});
			object.traverse(function(child) {
				if(child instanceof THREE.Mesh) {
					child.material = material;
				}
			});
			object.position.set(0, 0, 0);
			object.rotation.set(0, 0, Math.PI / 4);
			object.scale.set(0.04, 0.04, 0.04);
			TileTessellator.scene.add(object);
		});
		var texture = new THREE.Texture();
		texture.image = TileTessellator.imgLoader.load('assets/object/Oblivion/Oblivion.png');
		texture.needsUpdate = true;
		TileTessellator.objLoader.load('assets/object/Oblivion/Oblivion.obj', function(object){
			var material = new THREE.MeshPhongMaterial({map: texture, specular: 0x111111, shininess: 200});
			object.traverse(function(child) {
				if(child instanceof THREE.Mesh) {
					child.material = material;
				}
			});
			object.position.set(2, -2, -0.5);
			object.rotation.set(- Math.PI / 2, - Math.PI / 4, 0);
			object.scale.set(0.04, 0.04, 0.04);
			TileTessellator.scene.add(object);
			document.addEventListener("mousedown", onDocumentMouseDown, false);
		});
	} else {
		Detector.addGetWebGLMessage();
	}
});
