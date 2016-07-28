var mouse = new THREE.Vector2();
var raycaster;
var selectedMesh;

var rendererComponent = function( container, componentState ) {
	var c = container.getElement();
	$(c).css('overflow-y', 'scroll');
	
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(60, 1, 0.001, 100);
	camera.position.set(3, 3, 3);
	camera.lookAt(scene.position);
	
	light = new THREE.DirectionalLight(0xFFFFFF, 2, 100);
	light.position.set(1, 3, 2);
	scene.add(light);
	
	light2 = new THREE.DirectionalLight(0xFFFFFF, 2, 100);
	light2.position.set(-1, -3, -2);
	scene.add(light2);
	
	grid = new THREE.GridHelper(10/16, 1/16);
	grid.setColors(0xFFFFFF, 0xFFFFFF);
	grid.position.y = -0.501;
	scene.add(grid);
	
	if(Detector.webgl) renderer = new THREE.WebGLRenderer({alpha: true});
	else renderer = new THREE.CanvasRenderer({alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setClearColor(0xFFFFFF, 0);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.domElement.id = "renderer";
	$(c).html(renderer.domElement);
	
	controls = new THREE.OrbitControls(camera, renderer.domElement.parentElement);
	
	container.on( 'open', function() {
		var s = resizeGame(container.width, container.height);
		renderer.setSize(s.w, s.h);
		renderer.domElement.style.marginTop = (-s.h / 2) + 'px';
		renderer.domElement.style.marginLeft = (-s.w / 2) + 'px';
	});
	
	container.on( 'resize', function() {
		var s = resizeGame(container.width, container.height);
		renderer.setSize(s.w, s.h);
		renderer.domElement.style.marginTop = (-s.h / 2) + 'px';
		renderer.domElement.style.marginLeft = (-s.w / 2) + 'px';
	});
	
	scene.add(model);
	
	new Bound(0, 0, 0, 1, 1, 1);
	
	update();
	
	raycaster = new THREE.Raycaster();
	
	$(c).click(function( event ) {
		event.preventDefault();
		mouse.x = ( event.offsetX / renderer.getSize().width ) * 2 - 1;
		mouse.y = - ( event.offsetY / renderer.getSize().height ) * 2 + 1;
		
		raycaster.setFromCamera( mouse, camera );
		var intersections = raycaster.intersectObjects( model.children );
		var intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;
		
		if( intersection ) {
			if( selectedMesh ) scene.remove(selectedMesh);
			var obj = intersection.object;
			selectedMesh = new THREE.EdgesHelper( obj, 0xff0000 );
			scene.add( selectedMesh );
			myLayout.emit( 'selectBound', obj.uuid );
		} else {
			if( selectedMesh ) scene.remove(selectedMesh);
		}
	});
};

function update() {
	requestAnimationFrame( update );
	renderer.render( scene, camera );
}

function resizeGame(w, h) {
	var widthToHeight = 1;
	var newWidthToHeight = w / h;
	if(newWidthToHeight > widthToHeight) w = h * widthToHeight;
	else h = w / widthToHeight;
	return {w: w, h: h};
}
