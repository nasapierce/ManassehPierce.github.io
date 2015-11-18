
var MobRenderer, metaMapped = [];

$(document).ready(function(){
	init();
});

function init(){
	mapMeta();
	container = document.getElementById('container');
	
	MobRenderer = new EngineRenderer(container, true, false, false);
	MobRenderer.init();
	MobRenderer.render();
	
	MobRenderer.light.castShadow = true;
	MobRenderer.light.shadowDarkness = 0.5;
	MobRenderer.light.needsUpdate = true;
	
	MobRenderer.scene.remove(MobRenderer.ambeintLight);
	
	var terrain = MobRenderer.tgaLoader.load('assets/terrain-atlas.tga', function(tex){
		tex.magFilter = THREE.NearestFilter;
		tex.minFilter = THREE.LinearMipMapLinearFilter;
	});
	
	baseMaterial = new THREE.MeshLambertMaterial({map: terrain, side: THREE.FrontSide});
	baseGeometry = new THREE.CubeGeometry(1, 1, 1, 1, 1, 1);
	setBoundFaces(baseGeometry, ['planks']);
	baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
	baseMesh.castShadow = true;
	baseMesh.recieveShadow = true;
	baseMesh.position.set(0, -0.5, 0);
	MobRenderer.scene.add(baseMesh);
}

var textureUV = function(minU, minV, maxU, maxV){
	minU = minU * 16 / 256;
	minV = minV * 16 / 512;
	maxU = maxU * 16 / 256;
	maxV = maxV * 16 / 512;
	var t = [
		new THREE.Vector2(minV, maxU), 
		new THREE.Vector2(minV, minU), 
		new THREE.Vector2(maxV, minU), 
		new THREE.Vector2(maxV, maxU)
	];
	return t;
};

var texture = function(tname, data){
	for(var i in metaMapped){
		if(tname == metaMapped[i].name){
			if(metaMapped[i].uvs[data] !== null){
				return textureUV(metaMapped[i].uvs[data][0], metaMapped[i].uvs[data][1], metaMapped[i].uvs[data][2], metaMapped[i].uvs[data][3]);
				break;
			} else {
				return textureUV(metaMapped[i].uvs[0][0], metaMapped[i].uvs[0][1], metaMapped[i].uvs[0][2], metaMapped[i].uvs[0][3]);
				break;
			}
		}
	}
};

var setBoundFaces = function(bound, tex){
	if(tex.length === 1) tex = [tex[0], 0, tex[0], 0, tex[0], 0, tex[0], 0, tex[0], 0, tex[0], 0];
	if(tex.length === 2) tex = [tex[0], tex[1], tex[0], tex[1], tex[0], tex[1], tex[0], tex[1], tex[0], tex[1], tex[0], tex[1]];
	if(tex.length === 12) tex = [tex[0], tex[1], tex[2], tex[3], tex[4], tex[5], tex[6], tex[7], tex[8], tex[9], tex[10], tex[11]];
	bound.faceVertexUvs[0] = [];
	bound.faceVertexUvs[0][0] = [texture(tex[10],tex[11])[0], texture(tex[10],tex[11])[1], texture(tex[10],tex[11])[3]];
	bound.faceVertexUvs[0][1] = [texture(tex[10],tex[11])[1], texture(tex[10],tex[11])[2], texture(tex[10],tex[11])[3]];
	bound.faceVertexUvs[0][2] = [texture(tex[8],tex[9])[0], texture(tex[8],tex[9])[1], texture(tex[8],tex[9])[3]];
	bound.faceVertexUvs[0][3] = [texture(tex[8],tex[9])[1], texture(tex[8],tex[9])[2], texture(tex[8],tex[9])[3]];
	bound.faceVertexUvs[0][4] = [texture(tex[2],tex[3])[0], texture(tex[2],tex[3])[1], texture(tex[2],tex[3])[3]];
	bound.faceVertexUvs[0][5] = [texture(tex[2],tex[3])[1], texture(tex[2],tex[3])[2], texture(tex[2],tex[3])[3]];
	bound.faceVertexUvs[0][6] = [texture(tex[0],tex[1])[0], texture(tex[0],tex[1])[1], texture(tex[0],tex[1])[3]];
	bound.faceVertexUvs[0][7] = [texture(tex[0],tex[1])[1], texture(tex[0],tex[1])[2], texture(tex[0],tex[1])[3]];
	bound.faceVertexUvs[0][8] = [texture(tex[4],tex[5])[0], texture(tex[4],tex[5])[1], texture(tex[4],tex[5])[3]];
	bound.faceVertexUvs[0][9] = [texture(tex[4],tex[5])[1], texture(tex[4],tex[5])[2], texture(tex[4],tex[5])[3]];
	bound.faceVertexUvs[0][10] = [texture(tex[6],tex[7])[0], texture(tex[6],tex[7])[1], texture(tex[6],tex[7])[3]];
	bound.faceVertexUvs[0][11] = [texture(tex[6],tex[7])[1], texture(tex[6],tex[7])[2], texture(tex[6],tex[7])[3]];
};

var mapMeta = function(){
	for(var i=0;i<META.length;i++){ //152
		metaMapped.push({
			uvs: newUV(META[i].uvs),
			name: META[i].name
		});
	}
};

var opp = function(num, max){
	return max - num;
};

var newUV = function(uvs){
	var arr = [];
	for(var i=0;i<uvs.length;i++){
		arr.push([opp(uvs[i][3]*256/16, 16), uvs[i][0]*512/16, opp(uvs[i][1]*256/16, 16), uvs[i][2]*512/16]);
	}
	return arr;
};
