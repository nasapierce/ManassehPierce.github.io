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
	
	extrudeImage('images/tizona.png');
	
	light = new THREE.DirectionalLight(0xdddddd, 1);
	light.position.set(5, 5, 5).normalize();
	scene.add(light);
	
	ambientLight = new THREE.AmbientLight(0xcccccc);
	scene.add(ambientLight);
	
	grid = new THREE.GridHelper(7.5, 1);
	grid.setColors(0xffffff, 0xffffff);
	scene.add(grid);
	
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setClearColor(scene.fog.color);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);
	
	update();
}

function update() {
	requestAnimationFrame(update);
	render();
}

function render() {
	renderer.render(scene, camera);
}


var scale = 1, thr = 3;

function extrudeImage(src) {
	var canvas = document.createElement("CANVAS");
	var ctx = canvas.getContext("2d");
	var img = document.createElement("IMG");
	img.src = src;
	img.onload = function(e) {
		var iw = img.width;
		var ih = img.height;
		
		canvas.width = parseInt(iw*scale);
		canvas.height = parseInt(ih*scale);
		ctx.save();
		
		ctx.drawImage(this, 0, 0, iw, ih, 0, 0, canvas.width, canvas.height);
		ctx.restore();
		
		var texture = new THREE.Texture(canvas);
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.LinearMipMapLinearFilter;
		var cm = new THREE.MeshPhongMaterial({map:texture});
    	
		var g = new THREE.CanvasGeometry(canvas, {"height": 0.1, "solid": true, "offset": thr, "steps": 1});
    	
		canvas.width = iw;
    	canvas.height = ih;
    	ctx.save();
    	
		ctx.drawImage(this, 0, 0, iw, ih);
    	ctx.restore();
        
		var mesh = new THREE.Mesh(g,cm);
        ctx.fillStyle = "rgb(128,128,128)";
		ctx.fillRect(0, canvas.height-1, 1, 1);
        texture.needsUpdate = true;
     	
		mesh.position.x=-0.5;
		mesh.position.y=-0.5*(canvas.height/canvas.width);
		
		scene.add(mesh);
		//return mesh;
	};
}

/*

function setImage(src){
	img.src = src;
}

var ctx = canvas.getContext("2d");
var cross, scale=1, rotate=0, thr=3;
var renderNext=true,wavy=0,steps=1,last=null,amp=0.01;
$("#image").hide();

img.onload = function(e) {
	var mg = $(img);
	mg.show();
	var iw = mg.width();
	var ih=mg.height();
	mg.hide();
	
	canvas.width = parseInt(iw*window.scale);
	canvas.height = parseInt(ih*window.scale);
	ctx.save();
	
	if(window.rotate){
		ctx.translate(canvas.width/2,canvas.height/2);
		ctx.rotate(window.rotate);
		ctx.translate(-canvas.width/2,-canvas.height/2);
	}
	ctx.drawImage(this, 0, 0, iw, ih, 0, 0, canvas.width, canvas.height);
	ctx.restore();
	if(mesh) scene.remove(mesh);
        var texture = new THREE.Texture(canvas);
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.LinearMipMapLinearFilter;
		cm= new THREE.MeshPhongMaterial( { map:texture,shading: THREE.SmoothShading} );
    	var start=Date.now();
    	
    	var g = new THREE.CanvasGeometry(canvas,{"height":0.1,"solid":true,"offset":window.thr,"steps":1});
    	var diff = Date.now()-start;
    	canvas.width=iw;
    	canvas.height=ih;
    	ctx.save();
    	if(window.rotate){
			 ctx.translate(canvas.width/2,canvas.height/2);
			 ctx.rotate(window.rotate);
			ctx.translate(-canvas.width/2,-canvas.height/2);
		}
		
    	ctx.drawImage(this,0,0,iw,ih);
    	ctx.restore();
        
    	if(wavy){
			
			for(var i in g.vertices){
				g.vertices[i].z -= amp*Math.cos((g.vertices[i].y*ih)/wavy); 
			}
			g.computeFaceNormals();
			
		}
    	
        mesh=new THREE.Mesh(g,cm);
        ctx.fillStyle = "rgb(128,128,128)"; //Hack in case the (0,0) UV is transparent
		ctx.fillRect(0,canvas.height-1,1,1);
        texture.needsUpdate = true;
        mesh.position.x=-0.5;
		mesh.position.y=-0.5*(canvas.height/canvas.width);
		scene.add(mesh);
    	if(this.revokeMe){
			window.URL.revokeObjectURL(img.src);
			this.revokeMe=false;
		}
		last=img.src;
		img.src="";
    	renderNext=true;
    };
    
    function obj(){
		if(!mesh) return;
		var g=mesh.geometry;
		var vs=g.vertices,fs=g.faces,uvs=g.faceVertexUvs[0],sv="",sn="\n",st="\n",sf="\n",i=0,ni=0;
		g.computeVertexNormals();
		for(i=0;i!=vs.length;i++){
			sv += "v "+vs[i].x+" "+vs[i].y+" "+vs[i].z+"\n";
		}
		for(i=0;i!=fs.length;i++,ni+=3){
			sn += "vn "+fs[i].vertexNormals[0].x+" "+fs[i].vertexNormals[0].y+" "+fs[i].vertexNormals[0].z+"\n";
			sn += "vn "+fs[i].vertexNormals[1].x+" "+fs[i].vertexNormals[1].y+" "+fs[i].vertexNormals[1].z+"\n";
			sn += "vn "+fs[i].vertexNormals[2].x+" "+fs[i].vertexNormals[2].y+" "+fs[i].vertexNormals[2].z+"\n";
			st += "vt "+uvs[i][0].x+" "+uvs[i][0].y+"\n";
			st += "vt "+uvs[i][1].x+" "+uvs[i][1].y+"\n";
			st += "vt "+uvs[i][2].x+" "+uvs[i][2].y+"\n";
			sf += "f "+(fs[i].a+1)+"/"+(ni+1)+"/"+(ni+1)+" "+(fs[i].b+1)+"/"+(ni+2)+"/"+(ni+2)+" "+(fs[i].c+1)+"/"+(ni+3)+"/"+(ni+3)+"\n";
			//sf += "f "+(fs[i].a+1)+" "+(fs[i].b+1)+" "+(fs[i].c+1)+"\n";
		
		}
		return [sv,sn,st,sf];
	}
	var bob=null;
	function gen(){
		var b = new Blob(obj());
		if(bob) window.URL.revokeObjectURL(bob);
		bob = window.URL.createObjectURL(b);
		return bob;
	}
*/
