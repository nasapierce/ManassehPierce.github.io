var MinecraftCharacter, scene, camera, renderer, light;
var skinDir = "images/Darkserver.png";

$(document).ready(init);

function init() {
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(60, 64/96, 1, 1000);
	camera.position.set(0, 0, 3);
	camera.lookAt(scene.position);
	
	loader = new THREE.TextureLoader();
	
	MinecraftCharacter = new THREE.Group();
	
	var Skin = THREE.ImageUtils.loadTexture(skinDir);
	Skin.magFilter = THREE.NearestFilter;
	//Skin.minFilter = THREE.LinearMipMapLinearFilter;
	Skin.minFilter = THREE.NearestFilter;
	
	var Material = new THREE.MeshPhongMaterial({map: Skin, side: THREE.FrontSide, transparent: true, alphaTest: 0.5});
	var scale = 1.05;
	
	var HeadGeometry = addBox(0, 0, 64, 64, 8, 8, 8);
	var Head = new THREE.Mesh(HeadGeometry, Material);
	MinecraftCharacter.add(Head);
	
	var HeadOverlayGeometry = addBox(32, 0, 64, 64, 8, 8, 8);
	var HeadOverlay = new THREE.Mesh(HeadOverlayGeometry, Material);
	HeadOverlay.scale.multiplyScalar(scale);
	MinecraftCharacter.add(HeadOverlay);
	
	var BodyGeometry = addBox(16, 16, 64, 64, 8, 12, 4);
	var Body = new THREE.Mesh(BodyGeometry, Material);
	Body.position.set(0, -10/16, 0);
	MinecraftCharacter.add(Body);
	
	var BodyOverlayGeometry = addBox(16, 32, 64, 64, 8, 12, 4);
	var BodyOverlay = new THREE.Mesh(BodyOverlayGeometry, Material);
	BodyOverlay.position.set(0, -10/16, 0);
	BodyOverlay.scale.multiplyScalar(scale);
	MinecraftCharacter.add(BodyOverlay);
	
	var RightArmGeometry = addBox(40, 16, 64, 64, 4, 12, 4);
	var RightArm = new THREE.Mesh(RightArmGeometry, Material);
	RightArm.position.set(-6/16,-10/16,0);
	MinecraftCharacter.add(RightArm);
	
	var RightArmOverlayGeometry = addBox(40, 32, 64, 64, 4, 12, 4);
	var RightArmOverlay = new THREE.Mesh(RightArmOverlayGeometry, Material);
	RightArmOverlay.position.set(-6/16,-10/16,0);
	RightArmOverlay.scale.multiplyScalar(scale);
	MinecraftCharacter.add(RightArmOverlay);
	
	var LeftArmGeometry = addBox(32, 48, 64, 64, 4, 12, 4);
	var LeftArm = new THREE.Mesh(LeftArmGeometry, Material);
	LeftArm.position.set(6/16,-10/16,0);
	MinecraftCharacter.add(LeftArm);
	
	var LeftArmOverlayGeometry = addBox(48, 48, 64, 64, 4, 12, 4);
	var LeftArmOverlay = new THREE.Mesh(LeftArmOverlayGeometry, Material);
	LeftArmOverlay.position.set(6/16,-10/16,0);
	LeftArmOverlay.scale.multiplyScalar(scale);
	MinecraftCharacter.add(LeftArmOverlay);
	
	var RightLegGeometry = addBox(0, 16, 64, 64, 4, 12, 4);
	var RightLeg = new THREE.Mesh(RightLegGeometry, Material);
	RightLeg.position.set(-2/16,-22/16,0);
	MinecraftCharacter.add(RightLeg);
	
	var RightLegOverlayGeometry = addBox(0, 48, 64, 64, 4, 12, 4);
	var RightLegOverlay = new THREE.Mesh(RightLegOverlayGeometry, Material);
	RightLegOverlay.position.set(-2/16,-22/16,0);
	RightLegOverlay.scale.multiplyScalar(scale);
	MinecraftCharacter.add(RightLegOverlay);
	
	var LeftLegGeometry = addBox(16, 48, 64, 64, 4, 12, 4);
	var LeftLeg = new THREE.Mesh(LeftLegGeometry, Material);
	LeftLeg.position.set(2/16,-22/16,0);
	MinecraftCharacter.add(LeftLeg);
	
	var LeftLegOverlayGeometry = addBox(0, 32, 64, 64, 4, 12, 4);
	var LeftLegOverlay = new THREE.Mesh(LeftLegOverlayGeometry, Material);
	LeftLegOverlay.position.set(2/16,-22/16,0);
	LeftLegOverlay.scale.multiplyScalar(scale);
	MinecraftCharacter.add(LeftLegOverlay);
	
	MinecraftCharacter.position.set(0, 8/16, 0);
	scene.add(MinecraftCharacter);
	
	light = new THREE.DirectionalLight(0xFFFFFF, 1);
	light.position.set(2, 3, 1);
	scene.add(light);
	
	var ambientLight = new THREE.AmbientLight(0xcccccc);
	scene.add(ambientLight);
	
	if(Detector.webgl) renderer = new THREE.WebGLRenderer({alpha: true});
	else renderer = new THREE.CanvasRenderer({alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setClearColor(0xFFFFFF, 0);
	renderer.setSize(64, 96);
	renderer.domElement.style.position = "fixed";
	renderer.domElement.style.bottom = "0px";
	renderer.domElement.style.right = "0px";
	document.body.appendChild(renderer.domElement);
	
	var evt = window.navigator.msPointerEnabled ? "MSPointerMove" : "touchmove";
	var touchmoveEnabled = true;
	
	//desktop
	window.addEventListener("mousemove", function(e) {
		touchmoveEnabled = false;
		var y = ((e.clientX/2)-(window.innerWidth/2))/window.innerWidth;
		var x = ((e.clientY/2)-(window.innerHeight/2))/window.innerHeight;
		Head.rotation.x = x;
		HeadOverlay.rotation.x = x;
		Head.rotation.y = y;
		HeadOverlay.rotation.y = y;
		touchmoveEnabled = true;
	}, false);
	
	//touchscreen
	window.addEventListener(evt, function(e) {
		if(touchmoveEnabled) {
			var y = ((e.touches[0].clientX/2)-(window.innerWidth/2))/window.innerWidth;
			var x = ((e.touches[0].clientY/2)-(window.innerHeight/2))/window.innerHeight;
			Head.rotation.x = x;
			HeadOverlay.rotation.x = x;
			Head.rotation.y = y;
			HeadOverlay.rotation.y = y;
		}
	}, false);
	
	render();
}

function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

var addBox = function(u, v, texWidth, texHeight, width, height, depth) {
	var x0 = u;
	var x1 = u + depth;
	var x2 = u + depth + width;
	var x3 = u + depth + width + depth;
	var x4 = u + depth + width + depth + width;
	var y0 = texHeight - v;
	var y1 = texHeight - v - depth;
	var y2 = texHeight - v - depth - height;
	
	var BoxFront = UVCoordinateSet(x1, x2, y2, y1, texWidth, texHeight);
	var BoxTop = UVCoordinateSet(x1, x2, y1, y0, texWidth, texHeight);
	var BoxBottom = UVCoordinateSet(x2, x3, y1, y0, texWidth, texHeight);
	var BoxBack = UVCoordinateSet(x3, x4, y2, y1, texWidth, texHeight);
	var BoxRight = UVCoordinateSet(x0, x1, y2, y1, texWidth, texHeight);
	var BoxLeft = UVCoordinateSet(x2, x3, y2, y1, texWidth, texHeight);
	var BoxGeometry = new THREE.CubeGeometry(width/16, height/16, depth/16);
	BoxGeometry.faceVertexUvs[0] = [];
	BoxGeometry.faceVertexUvs[0][8] = [BoxFront[0], BoxFront[1], BoxFront[3]];
	BoxGeometry.faceVertexUvs[0][9] = [BoxFront[1], BoxFront[2], BoxFront[3]];
	BoxGeometry.faceVertexUvs[0][4] = [BoxTop[0], BoxTop[1], BoxTop[3]];
	BoxGeometry.faceVertexUvs[0][5] = [BoxTop[1], BoxTop[2], BoxTop[3]];
	BoxGeometry.faceVertexUvs[0][2] = [BoxLeft[0], BoxLeft[1], BoxLeft[3]];
	BoxGeometry.faceVertexUvs[0][3] = [BoxLeft[1], BoxLeft[2], BoxLeft[3]];
	BoxGeometry.faceVertexUvs[0][0] = [BoxRight[0], BoxRight[1], BoxRight[3]];
	BoxGeometry.faceVertexUvs[0][1] = [BoxRight[1], BoxRight[2], BoxRight[3]];
	BoxGeometry.faceVertexUvs[0][10] = [BoxBack[0], BoxBack[1], BoxBack[3]];
	BoxGeometry.faceVertexUvs[0][11] = [BoxBack[1], BoxBack[2], BoxBack[3]];
	BoxGeometry.faceVertexUvs[0][6] = [BoxBottom[0], BoxBottom[1], BoxBottom[3]];
	BoxGeometry.faceVertexUvs[0][7] = [BoxBottom[1], BoxBottom[2], BoxBottom[3]];
	return BoxGeometry;
};

function UVCoordinateSet(minU, maxU, minV, maxV, width, height) {
	return [ new THREE.Vector2(maxU/width, maxV/height),
		new THREE.Vector2(maxU/width, minV/height),
		new THREE.Vector2(minU/width, minV/height),
		new THREE.Vector2(minU/width, maxV/height) ];
}
