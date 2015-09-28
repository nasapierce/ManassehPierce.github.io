var EngineRenderer = function (container, showGrid, showAxes, showBase) {
	var _this = this;
	this.showGrid = showGrid || false;
	this.showAxes = showAxes || false;
	this.showBase = showBase || false;
	this.voxelBounds = [];
	this.container = container || document;
	this.objLoader = new THREE.OBJLoader();
	this.tgaLoader = new THREE.TGALoader();
	this.imgLoader = new THREE.ImageLoader();
	
	_this.init = function() {
		_this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
		_this.camera.position.x = 10;
		_this.camera.position.y = 5;
		_this.camera.position.z = 10;
		
		_this.controls = new THREE.OrbitControls(_this.camera, _this.container);
		_this.controls.damping = 0.2;
		_this.controls.addEventListener('change', _this.render);
		
		_this.scene = new THREE.Scene();
		_this.scene.fog = new THREE.Fog(0xcccccc, 0.008);
		
		_this.light = new THREE.DirectionalLight(0xdddddd, 1);
		_this.light.position.set(2, 2, 2).normalize();
		_this.scene.add(_this.light);
		
		_this.ambientLight = new THREE.AmbientLight(0xcccccc);
		_this.scene.add(_this.ambientLight);
		
		_this.helperGrid = new THREE.GridHelper(7.5, 1);
		_this.helperGrid.setColors(0xffffff, 0xffffff);
		_this.helperGrid.translateX(0.0);
		_this.helperGrid.translateZ(0.0);
		if(_this.showGrid) _this.scene.add(_this.helperGrid);
		
		_this.helperAxes = new THREE.AxisHelper(2);
		_this.helperAxes.translateY(0.01);
		if(_this.showAxes) _this.scene.add(_this.helperAxes);
		
		_this.helperBaseGeometry = new THREE.CubeGeometry(1, 1, 1);
		if(!_this.helperBaseMaterial)_this.helperBaseMaterial = new THREE.MeshLambertMaterial({color: 0x797979});
		_this.helperBase = new THREE.Mesh(_this.helperBaseGeometry, _this.helperBaseMaterial);
		_this.helperBase.position.set(0.5, -0.5, 0.5);
		if(_this.showBase) _this.scene.add(_this.helperBase);
		
		if(Detector.webgl){
			_this.renderer = new THREE.WebGLRenderer({antialias: true});
		}
		if(!Detector.webgl){
			_this.renderer = new THREE.CanvasRenderer();
		}
		
		_this.renderer.setClearColor(_this.scene.fog.color);
		_this.renderer.setPixelRatio(window.devicePixelRatio);
		_this.renderer.setSize(window.innerWidth, window.innerHeight);
    	
		_this.container.appendChild(_this.renderer.domElement);
		
		_this.update();
	};
	
	_this.render = function() {
		_this.renderer.render(_this.scene, _this.camera);
	};
	
	_this.update = function() {
		requestAnimationFrame(_this.update);
		_this.render();
	};
	
	_this.toggleHelperAxes = function() {
		if(!_this.showAxes){
			_this.showAxes = true;
			_this.scene.add(_this.helperAxes);
		}
		else if(_this.showAxes){
			_this.showAxes = false;
			_this.scene.remove(_this.helperAxes);
		}
	};
	
	_this.toggleHelperBase = function() {
		if(!_this.showBase){
			_this.showBase = true;
			_this.scene.add(_this.helperBase);
		} 
		else if(_this.showBase) {
			_this.showBase = false;
			_this.scene.remove(_this.helperBase);
		}
	};
	
	_this.toggleHelperGrid = function() {
		if(!_this.showGrid){
			_this.showGrid = true;
			_this.scene.add(_this.helperGrid);
		} 
		else if(_this.showGrid) {
			_this.showGrid = false;
			_this.scene.remove(_this.helperGrid);
		}
	};
	
};
