/* 	You may not use this code without my permission, I dont care if you look to learn,
But any straight/obvious copy/pasting will result obstructed files in the future. */

//#### TODO ####
// vertexUV (x, y, z, minU, maxU);
// edit bounds
// make things see-able inside each other
//##############

/*

*/

$(document).ready(function() {
    if(!Detector.webgl) {
        Detector.addGetWebGLMessage();
    } else {
        Tessellation.init();
        Tessellation.render();
    }
});


var Tessellation = {
	bounds: [],
	boundFolder: null,
    container: null,
    stats: null,
    realGui: null,
	terrain: new THREE.TGALoader().load(
		'assets/terrain-atlas.tga',
		function(tex){
			tex.magFilter = THREE.NearestFilter;
			tex.minFilter = THREE.LinearMipMapLinearFilter;
		},
		function(prog){},
		function(err){}
	),
    camera: null,
    orbit: null,
    scene: null,
	sceneOffset: 0.5,
    renderer: null,
    controls: null,
	
    axes: null,
    grid: null,
	baseMesh: null,
	
	showGrid: true,
	showAxes: false,
	showStats: false,
	showBase: true
};


Tessellation.init = function() {
	Tessellation.mapMeta();
	
    Tessellation.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    Tessellation.camera.position.x = 10;
    Tessellation.camera.position.y = 10;
    Tessellation.camera.position.z = 10;
	
    Tessellation.orbit = new THREE.OrbitControls(Tessellation.camera);
    Tessellation.orbit.damping = 0.2;
    Tessellation.orbit.addEventListener('change', Tessellation.render);
    
    Tessellation.scene = new THREE.Scene();
    Tessellation.scene.fog = new THREE.Fog(0xcccccc, 0.008);
    
	var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    Tessellation.scene.add(light);
	
	var ambientLight = new THREE.AmbientLight(0xcccccc);
	Tessellation.scene.add(ambientLight);
	
    Tessellation.grid = new THREE.GridHelper(17, 1);
    Tessellation.grid.setColors(0xffffff, 0xffffff);
    Tessellation.grid.translateX(Tessellation.sceneOffset);
    Tessellation.grid.translateZ(Tessellation.sceneOffset);
	if(Tessellation.showGrid) Tessellation.scene.add(Tessellation.grid);
	
	var baseBlock = new THREE.CubeGeometry(1, 1, 1);
	var baseMaterial = new THREE.MeshLambertMaterial({map: Tessellation.terrain});
	Tessellation.setBoundFaces(baseBlock, ["planks", 0]);
	Tessellation.baseMesh = new THREE.Mesh(baseBlock, baseMaterial);
    Tessellation.baseMesh.position.set(0.5-Tessellation.sceneOffset, -0.5, 0.5-Tessellation.sceneOffset);
    if(Tessellation.showBase) Tessellation.scene.add(Tessellation.baseMesh);
	
    Tessellation.axes = new THREE.AxisHelper(2);
    Tessellation.axes.translateY(0.01);
    if(Tessellation.showAxes) Tessellation.scene.add(Tessellation.axes);
	
	Tessellation.renderer = new THREE.WebGLRenderer({antialias: false});
    Tessellation.renderer.setClearColor(Tessellation.scene.fog.color);
    Tessellation.renderer.setPixelRatio(window.devicePixelRatio);
    Tessellation.renderer.setSize(window.innerWidth, window.innerHeight);
    
    Tessellation.container = document.getElementById('container');
    Tessellation.container.appendChild(Tessellation.renderer.domElement);
    
    Tessellation.stats = new Stats();
    Tessellation.stats.domElement.style.position = 'absolute';
    Tessellation.stats.domElement.style.top = '0px';
    Tessellation.stats.domElement.style.zIndex = 100;
    if(Tessellation.showStats) Tessellation.scene.add(Tessellation.stats);
	
    Tessellation.realGui = new Tessellation.gui();
	
    window.addEventListener('resize', Tessellation.onWindowResize, false);
    window.addEventListener('addBox', Tessellation.onAddBox);
    window.addEventListener('addBound', Tessellation.onAddBound);
    window.addEventListener('exportBounds', Tessellation.onExportBounds);
    window.addEventListener('exportBox', Tessellation.onExportBox);
    window.addEventListener('importBounds', Tessellation.importBounds);
    window.addEventListener('clearScene', Tessellation.onClearScene);
	window.addEventListener('toggle-stats', Tessellation.onStatsToggle);
    window.addEventListener('toggle-grid', Tessellation.onGridToggle);
	window.addEventListener('toggle-axes', Tessellation.onAxesToggle);
	window.addEventListener('toggle-base', Tessellation.onBaseToggle);
	
    Tessellation.update();
};


Tessellation.refreshScene = function(){
	var temp = Tessellation.bounds;
	for(var i=0;i<Tessellation.bounds.length;i++){
		Tessellation.scene.remove(Tessellation.bounds[i].obj);
	}
	Tessellation.bounds = [];
	for(var i=0;i<temp.length;i++){
		Tessellation.renderBound(temp[i].min, temp[i].max, temp[i].texture, temp[i].name, temp[i].isBox);
	}
};


Tessellation.update = function() {
    requestAnimationFrame(Tessellation.update);
    Tessellation.stats.update();
    Tessellation.orbit.update();
    Tessellation.render();
	
	for (var i in Tessellation.controls.gui.__controllers) {
		Tessellation.controls.gui.__controllers[i].updateDisplay();
	}
};


Tessellation.render = function() {
    Tessellation.renderer.render(Tessellation.scene, Tessellation.camera);
};


var toVec3 = function(x, y, z){
    var r = {x:x, y:y, z:z};
    return r;
};

var noSp = function(str){
	return str.replace(/\s+/g, '');
};

 
Tessellation.renderBound = function(min, max, texture, name, isBox){
	var t = texture.split(",");
	if(t.length === 1) texture = [noSp(t[0])];
	if(t.length === 2) texture = [noSp(t[0]), parseInt(t[1])];
	if(t.length === 12) texture = [noSp(t[0]), parseInt(t[1]), noSp(t[0]), parseInt(t[3]), noSp(t[0]), parseInt(t[5]), noSp(t[0]), parseInt(t[7]), noSp(t[0]), parseInt(t[9]), noSp(t[0]), parseInt(t[11])];
	if(isBox){
        min = {x:min.x/16, y:min.y/16, z:min.z/16};
        max = {x:max.x/16, y:max.y/16, z:max.z/16};
    } else {
        min = min;
        max = max;
    }
     
    var width = max.x-min.x, height = max.y-min.y, depth = max.z-min.z;
     
    var bound = new THREE.CubeGeometry(max.x-min.x, max.y-min.y, max.z-min.z, 1, 1, 1 );
    var material = new THREE.MeshLambertMaterial({map: Tessellation.terrain, transparent: true, side: THREE.FrontSide});
    
	Tessellation.setBoundFaces(bound, texture);
	
	var mesh = new THREE.Mesh(bound, material);
    mesh.position.set((width/2)+min.x-Tessellation.sceneOffset, (height/2)+min.y, (depth/2)+min.z-Tessellation.sceneOffset);
    Tessellation.scene.add(mesh);
	
	Tessellation.bounds.push({obj: mesh, name: name, min: {x:min.x,y:min.y, z:min.z}, max: {x:max.x,y:max.y, z:max.z}, texture: texture, isBox: isBox});
	
	$('#edit').show();
	$('#editMenu').append("<a class='dropdown-item' onclick='Tessellation.onEditBound("+Tessellation.bounds.length+");'>"+name+"</a>");
};


function getBoundString(tessellationName){
    var bString = "#include <mcpe/client/renderer/TileTessellator.h>\n\nbool TileTessellator::tessellate"+tessellationName+"InWorld(Tile* tile, TilePos const& pos){\n";
    for(var i=0;i<Tessellation.bounds.length;i++){
        bString += "    setRenderBounds("+Tessellation.bounds[i].min.x+", "+Tessellation.bounds[i].min.y+", "+Tessellation.bounds[i].min.z+", "+Tessellation.bounds[i].max.x+", "+Tessellation.bounds[i].max.y+", "+Tessellation.bounds[i].max.z+");\n    tessellateBlockInWorld(tile, pos);\n";
    }
    bString+= "}";
    return bString;
}


function getBoxString(tessellationName){
    var bString = "#include <mcpe/client/renderer/TileTessellator.h>\n\nbool TileTessellator::tessellate"+tessellationName+"InWorld(Tile* tile, TilePos const& pos){\n";
    for(var i=0;i<Tessellation.bounds.length;i++){
        bString += "    addBox("+Tessellation.bounds[i].min.x*16+", "+Tessellation.bounds[i].min.y*16+", "+Tessellation.bounds[i].min.z*16+", "+Tessellation.bounds[i].max.x*16+", "+Tessellation.bounds[i].max.y*16+", "+Tessellation.bounds[i].max.z*16+");\n    tessellateBlockInWorld(tile, pos);\n";
    }
    bString+= "}";
    return bString;
}
 
     
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
 
 
Tessellation.importBounds = function(){
	var im = $('#tessellationImport').val();
	if(im){
        var lines = im.split(";");
        for(var i=0;i<lines.length;i++){
            if(lines[i].split('(')[0]=='addBox'||lines[i].split('(')[0]=='	addBox'||lines[i].split('(')[0]==' addBox'){
                var par = lines[i].split('(')[1].split(')')[0].split(',');
                Tessellation.renderBound(toVec3(parseFloat(par[0]), parseFloat(par[1]), parseFloat(par[2])), toVec3(parseFloat(par[3]), parseFloat(par[4]), parseFloat(par[5])), 'stone', 'Import Box '+i, true);
            }
            else if(lines[i].split('(')[0]=='setRenderBounds'){
                 var par = lines[i].split('(')[1].split(')')[0].split(',');
                Tessellation.renderBound(toVec3(parseFloat(par[0]), parseFloat(par[1]), parseFloat(par[2])), toVec3(parseFloat(par[3]), parseFloat(par[4]), parseFloat(par[5])), 'stone', 'Import Box '+i, false);
            }
			else{
				//ignore it?
			}
        }
    }
};


Tessellation.gui = function() {
    Tessellation.controls = {
        gui: null,
    };
     
    var controls = Tessellation.controls;
     
    var init = function(){
        controls.gui = new dat.GUI({autoPlace: false});
         
        Tessellation.container.appendChild(controls.gui.domElement);
        Tessellation.controls.gui.domElement.style.position = 'absolute';
        Tessellation.controls.gui.domElement.style.bottom = '20px';
        Tessellation.controls.gui.domElement.style.right = '0px';
        Tessellation.controls.gui.domElement.style.zIndex = 100;
         
        var controlFolder = controls.gui.addFolder("Controls");
		
        controlFolder.add(controls, "Actions");
        controlFolder.add(controls, "Scene");
        controlFolder.add(controls, "Settings");
	};
     
	controls["Actions"] = function() {
        $('#actionsModal').modal('show');
    };
	
	controls["Scene"] = function() {
        $('#sceneModal').modal('show');
    };
	
	controls["Settings"] = function() {
        $('#settingsModal').modal('show');
    };
	
    init.call(this);
};


Tessellation.onClearScene = function(){
	var c = confirm(Tessellation.lang[Tessellation.language].clearScene);
	if(c){
		for(var i=0;i<Tessellation.bounds.length;i++){
			Tessellation.scene.remove(Tessellation.bounds[i].obj);
		}
		Tessellation.bounds = [];
	}
};


Tessellation.onWindowResize = function() {
    Tessellation.camera.aspect = window.innerWidth / window.innerHeight;
    Tessellation.camera.updateProjectionMatrix();
    Tessellation.renderer.setSize(window.innerWidth, window.innerHeight);
};


Tessellation.onAddBox = function(){
	var c = $('#boxMin').val();
	var s = $('#boxMax').val();
	var t = $('#boxTexture').val();
	var n = $('#boxName').val();
	Tessellation.renderBound(toVec3(parseFloat(c.split(",")[0]),parseFloat(c.split(",")[1]),parseFloat(c.split(",")[2])), toVec3(parseFloat(s.split(",")[0]),parseFloat(s.split(",")[1]),parseFloat(s.split(",")[2])),t,n,true);
};
 
 
Tessellation.onAddBound = function(){
    var c = $('#boxMin').val();
	var s = $('#boxMax').val();
	var t = $('#boxTexture').val();
	var n = $('#boxName').val();
	Tessellation.renderBound(toVec3(parseFloat(c.split(",")[0]),parseFloat(c.split(",")[1]),parseFloat(c.split(",")[2])), toVec3(parseFloat(s.split(",")[0]),parseFloat(s.split(",")[1]),parseFloat(s.split(",")[2])),t,n,false);
};
 
 
Tessellation.onExportBounds = function(){
	var n = $('#tessellationName').val();
    if(n) var c = confirm(Tessellation.lang[Tessellation.language].cppFile+n);
   	if(c) download(n+".cpp",getBoundString(n));
};


Tessellation.onEditBound = function(i){
	$('#edit-form').show();
	$('#scene-form').hide();
	$('#scene-execute').html("Edit Bound");
	$('#bound').attr("bound",i);
	$('#eboxName').val(Tessellation.bounds[i].name);
	$('#eboxMin').val(Tessellation.bounds[i].min.x+", "+Tessellation.bounds[i].min.y+", "+Tessellation.bounds[i].min.z);
	$('#eboxMax').val(Tessellation.bounds[i].max.x+", "+Tessellation.bounds[i].max.y+", "+Tessellation.bounds[i].max.z);
	$('#eboxTexture').val(Tessellation.bounds[i].texture);
};


Tessellation.onExportBox = function(){
	var n = $('#tessellationName');
	if(n) var c = confirm(Tessellation.lang[Tessellation.language].cppFile+n);
    if(c) download(n+".cpp",getBoxString(n));
};


Tessellation.onStatsToggle = function(e) {
	if(!Tessellation.showStats){
		Tessellation.showStats = true;
		Tessellation.container.appendChild(Tessellation.stats.domElement);
    } else {
		Tessellation.showStats = false;
        Tessellation.container.removeChild(Tessellation.stats.domElement);
	}
};


Tessellation.onGridToggle = function(e) {
	if(!Tessellation.showGrid){
		Tessellation.showGrid = true;
		Tessellation.scene.add(Tessellation.grid);
    } else {
		Tessellation.showGrid = false;
        Tessellation.scene.remove(Tessellation.grid);
	}
};


Tessellation.onAxesToggle = function(e) {
	if(!Tessellation.showAxes){
		Tessellation.showAxes = true;
		Tessellation.scene.add(Tessellation.axes);
    } else {
		Tessellation.showAxes = false;
        Tessellation.scene.remove(Tessellation.axes);
	}
};


Tessellation.onBaseToggle = function(e) {
	if(!Tessellation.showBase){
		Tessellation.showBase = true;
		Tessellation.scene.add(Tessellation.baseMesh);
    } else {
		Tessellation.showBase = false;
        Tessellation.scene.remove(Tessellation.baseMesh);
	}
};


/* Language */
Tessellation.language = navigator.language.split("-")[0];


Tessellation.lang = {
	"en": {
		importPrompt: 'Paste addBox, setRenderBounds, whole class... Whatever "floats" your boat ;)',
		clearScene: "Do you want to clear the scene? All bounds will be lost",
		addBoxMin: "Enter Min X, Y, Z",
		addBoxMax: "Enter Max X, Y, Z",
		addBoxName: "Enter Box Name",
		addBoxTexture: "Enter Box Texture, [stone], [stone, 0], or 6 of [stone, 0] ordered like so: bottom, top, south, north, west, east",
		cppFile: "Download cpp file of Tessellation",
		nameTessellation: "Name the Tessellation, also name of the class"
	}
};


/* Textures */
Tessellation.texture = function(tname, data){
	for(var i in Tessellation.metaMapped){
		if(tname == Tessellation.metaMapped[i].name){
			if(Tessellation.metaMapped[i].uvs[data] !== null){
				return Tessellation.textureUV(Tessellation.metaMapped[i].uvs[data][0], Tessellation.metaMapped[i].uvs[data][1], Tessellation.metaMapped[i].uvs[data][2], Tessellation.metaMapped[i].uvs[data][3]);
				break;
			} else {
				return Tessellation.textureUV(Tessellation.metaMapped[i].uvs[0][0], Tessellation.metaMapped[i].uvs[0][1], Tessellation.metaMapped[i].uvs[0][2], Tessellation.metaMapped[i].uvs[0][3]);
				break;
			}
		}
	}
};


Tessellation.textureUV = function(minU, minV, maxU, maxV){
	minU = minU*16/256;
	minV = minV*16/512;
	maxU = maxU*16/256;
	maxV = maxV*16/512;
	var t = [
		//lower left 0, 0
		new THREE.Vector2(minV, maxU), 
		//lower right 1, 0
		new THREE.Vector2(minV, minU), 
		//upper right 1, 1
		new THREE.Vector2(maxV, minU), 
		//upper left 0, 1
		new THREE.Vector2(maxV, maxU)
	];
	return t;
};


Tessellation.setBoundFaces = function(bound, tex){
	//bottom, top, south, north, west, east
	if(tex.length === 1) tex = [tex[0], 0, tex[0], 0, tex[0], 0, tex[0], 0, tex[0], 0, tex[0], 0];
	if(tex.length === 2) tex = [tex[0], tex[1], tex[0], tex[1], tex[0], tex[1], tex[0], tex[1], tex[0], tex[1], tex[0], tex[1]];
	if(tex.length === 12) tex = [tex[0], tex[1], tex[2], tex[3], tex[4], tex[5], tex[6], tex[7], tex[8], tex[9], tex[10], tex[11]];
	
	bound.faceVertexUvs[0] = [];
	//east
	bound.faceVertexUvs[0][0] = [Tessellation.texture(tex[10],tex[11])[0], Tessellation.texture(tex[10],tex[11])[1], Tessellation.texture(tex[10],tex[11])[3] ];
	bound.faceVertexUvs[0][1] = [Tessellation.texture(tex[10],tex[11])[1], Tessellation.texture(tex[10],tex[11])[2], Tessellation.texture(tex[10],tex[11])[3] ];
	//west
	bound.faceVertexUvs[0][2] = [ Tessellation.texture(tex[8],tex[9])[0], Tessellation.texture(tex[8],tex[9])[1], Tessellation.texture(tex[8],tex[9])[3] ];
	bound.faceVertexUvs[0][3] = [ Tessellation.texture(tex[8],tex[9])[1], Tessellation.texture(tex[8],tex[9])[2], Tessellation.texture(tex[8],tex[9])[3] ];
	//top
	bound.faceVertexUvs[0][4] = [ Tessellation.texture(tex[2],tex[3])[0], Tessellation.texture(tex[2],tex[3])[1], Tessellation.texture(tex[2],tex[3])[3] ];
	bound.faceVertexUvs[0][5] = [ Tessellation.texture(tex[2],tex[3])[1], Tessellation.texture(tex[2],tex[3])[2], Tessellation.texture(tex[2],tex[3])[3] ];
	//bottom
	bound.faceVertexUvs[0][6] = [ Tessellation.texture(tex[0],tex[1])[0], Tessellation.texture(tex[0],tex[1])[1], Tessellation.texture(tex[0],tex[1])[3] ];
	bound.faceVertexUvs[0][7] = [ Tessellation.texture(tex[0],tex[1])[1], Tessellation.texture(tex[0],tex[1])[2], Tessellation.texture(tex[0],tex[1])[3] ];
	//south
	bound.faceVertexUvs[0][8] = [ Tessellation.texture(tex[4],tex[5])[0], Tessellation.texture(tex[4],tex[5])[1], Tessellation.texture(tex[4],tex[5])[3] ];
	bound.faceVertexUvs[0][9] = [ Tessellation.texture(tex[4],tex[5])[1], Tessellation.texture(tex[4],tex[5])[2], Tessellation.texture(tex[4],tex[5])[3] ];
	//north
	bound.faceVertexUvs[0][10] = [ Tessellation.texture(tex[6],tex[7])[0], Tessellation.texture(tex[6],tex[7])[1], Tessellation.texture(tex[6],tex[7])[3] ];
	bound.faceVertexUvs[0][11] = [ Tessellation.texture(tex[6],tex[7])[1], Tessellation.texture(tex[6],tex[7])[2], Tessellation.texture(tex[6],tex[7])[3] ];
};

Tessellation.metaMapped = [];

Tessellation.mapMeta = function(){
	for(var i=0;i<META.length;i++){ //152
		Tessellation.metaMapped.push({
			uvs: Tessellation.newUV(META[i].uvs),
			name: META[i].name
		});
	}
};


var opp = function(num, max){
	return max - num;
};


Tessellation.newUV = function(uvs){
	var arr = [];
	for(var i=0;i<uvs.length;i++){
		arr.push([opp(uvs[i][3]*256/16, 16), uvs[i][0]*512/16, opp(uvs[i][1]*256/16, 16), uvs[i][2]*512/16]);
	}
	return arr;
};

