var Bounds = [];
var UUIDS = [];
var model = new THREE.Group();

var randUUID = function() {
	var uuid = "";
	var char0 = Math.floor(Math.random()*25)+97;
	var char1 = Math.floor(Math.random()*25)+97;
	uuid += String.fromCharCode(char0);
	uuid += String.fromCharCode(char1);
	return uuid;
};

var Bound = function(x1, y1, z1, x2, y2, z2) {
	if(Bounds.length !== 0) {
		var f = false;
		while(!f) {
			var u = randUUID();
			if(UUIDS.indexOf(u) == -1) f = true;
			this.uuid = u;
		}
	} else {
		this.uuid = randUUID();
	}
	this.name = 'Bound';
	this.x1 = x1;
	this.y1 = y1;
	this.z1 = z1;
	this.x2 = x2;
	this.y2 = y2;
	this.z2 = z2;
	this.width = (x2 - x1) / 16;
	this.height = (y2 - y1) / 16;
	this.depth = (z2 - z1) / 16;
	this.opacity = 1.0;
	this.visible = true;
	this.geometry = new THREE.CubeGeometry(this.width, this.height, this.depth, 1, 1, 1);
	this.material = new THREE.MeshLambertMaterial({color: 0xd3d3d3, transparent: true, side: THREE.FrontSide});
	this.mesh = new THREE.Mesh(this.geometry, this.material);
	this.mesh.position.set((this.width/2) + this.x1 - 0.5, (this.height/2) + this.y1 - 0.5, (this.depth/2) + this.z1 - 0.5);
	this.mesh.uuid = this.uuid;
	model.add(this.mesh);
	Bounds.push(this);
	UUIDS = Bounds.map(function(b){return b.mesh.uuid;});
};

Bound.prototype.updateSize = function() {
	this.width = (this.x2 - this.x1) / 16;
	this.height = (this.y2 - this.y1) / 16;
	this.depth = (this.z2 - this.z1) / 16;
	this.geometry = new THREE.CubeGeometry(this.width, this.height, this.depth, 1, 1, 1);
	this.mesh.geometry = this.geometry;
	this.mesh.position.set((this.width/2) + (this.x1/16) - 0.5, (this.height/2) + (this.y1/16) - 0.5, (this.depth/2) + (this.z1/16) - 0.5);
};

Bound.prototype.updateOpacity = function() {
	this.mesh.material.opacity = this.opacity;
};

Bound.prototype.remove = function() {
	model.remove(this.mesh);
	Bounds.splice(Bounds.indexOf(this), 1);
	UUIDS = Bounds.map(function(b){return b.uuid;});
	myLayout.emit('deselectBound');
	if( selectedMesh ) scene.remove(selectedMesh);
};
