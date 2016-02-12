/** 
* @author wizgrav / http://www.revoxel.com, 
* Running Image Triangulation and Extrusion 
* An efficient method for extruding bitmaps 
* options = { 
*	offset: <int> // Test offset. 3 bytes for Alpha. 
*   height: <float>, // thickness to extrude bitmap 
*   solid: <bool>, //Whether to produce a solid or plane 
*   steps: <int>, // Number of steps for sidewall creation 
*   material: <int> // material index for front and back faces 
*   extrudeMaterial: <int> // material index for extrusion faces 
*   extrudeFunc: <Function> // function for extrusion face creation 
* } 
**/ 
THREE.CanvasGeometry = function ( canvas, options ) {
 	if ( typeof( canvas ) === "undefined" ) {
 		return;
	}else if(!canvas.nodeName){
 		return;
	}else if(canvas.nodeName != "CANVAS"){
 		return;
	}
	THREE.Geometry.call( this );
	this.run( canvas, options );
};

THREE.CanvasGeometry.prototype = Object.create( THREE.Geometry.prototype ); 

THREE.CanvasGeometry.prototype.run = function ( canvas, options ) {
	var steps = options.steps !== undefined ? (parseInt(options.steps) > 0 ? parseInt(options.steps) : 1) : 1;
	var z = options.height !== undefined ? (options.height > 0 ? options.height:0.1) : 0.1;
	var material = options.material;
	var solid = options.solid !== undefined ? options.solid:true; 
	var off = options.offset !== undefined ? options.offset % 4 : 3; 
	var extrudeMaterial = options.extrudeMaterial; 	 	//This is the function that creates the sidewall faces, override with care 
	var ef = typeof(options.extrudeFunc) == "function" ? options.extrudeFunc : 	function(vs,fs,uvs,pa,pb,na,nb,nx,ny,step,steps,mtl){
 		var fc=new THREE.Face3(pb,na,pa,null, null, mtl);
 		fc.normal.set(nx,ny,0).normalize();
 		fs.push(fc);
 		fc=new THREE.Face3(nb,na,pb,null, null, mtl);
 		fc.normal.set(nx,ny,0).normalize();
 		fs.push(fc);
 		uvs.push([
			new THREE.Vector2(0,0),
 			new THREE.Vector2(0,0),
 			new THREE.Vector2(0,0)
		]);
 		uvs.push([
			new THREE.Vector2(0,0),
 			new THREE.Vector2(0,0),
 			new THREE.Vector2(0,0) 
		]); 
	}; 
	var ctx = canvas.getContext("2d");
	var vertices = this.vertices,
	faces = this.faces,
	fUvs=this.faceVertexUvs[0],side=[]; 
	var running=0,n=0,ps,pe,pt=0,t,checked,pl=0,nl=0,parent,f,ff,uvs,fl,vl,ht;
 	var i,j,c=0,width=canvas.width,height=canvas.height;
 	var dt=ctx.getImageData(0,0,width,height);
 	var yunit=1/height;
 	var xunit=1/width;
 	var data=dt.data;
	for(i=0; i < height; i++){
		ps=pt; 
		pe=n; 
		pt=0; 
		parent=0; 
		j=0; 
		c=4*(i*width+j);
 		data[c+4*width-1]=0; 
		nv = 1 - i/height; 
		pv = 1 - ((i-1)/height); 
		ht = (height-i)*xunit; 
		for(; j < width;j++, c += 4){
 			if(data[c+off]){
 				if(!running){ 
					vertices.push(new THREE.Vector3(
						(j+(1-data[c+3]/256))/width,
						ht,
						z
 					));
 					if(!pt) pt=n+1;
 						running=1;
					}
				}else if(running){
					vertices.push(new THREE.Vector3(
	 					(j-(1-data[c-1]/256))/width,
						ht,
						z
					));
					if(ps){
						checked=0;
						for(t=ps;t < pe;t+=2){
							if(vertices[t].x <= vertices[n].x-xunit){
								ps = t+2;
								if(parent < t && vertices[t-1].z > 0){
									side.push([t,t-1,0,-1]);
								}
								if(vertices[t].z<0){
									side.push([t+1,t,0,-1]);
									vertices[t].z = -vertices[t].z;
								}
								continue;
							}
							if(vertices[t-1].x <= vertices[n+1].x+xunit){
								if(vertices[t-1].z < 0){
 									side.push([t-1,t,0,1]);
 									vertices[t-1].z=-vertices[t-1].z;
								}
								if(!checked){
									if(parent == t){
										f= new THREE.Face3( t, n-1,n,null, null, material);
										f.normal.set(0,0,1);
										faces.push(f);
										fUvs.push([
	 										new THREE.Vector2(vertices[t].x,pv),
											new THREE.Vector2(vertices[n-1].x,nv),
											new THREE.Vector2(vertices[n].x,nv)
										]);
										if(vertices[n-1].z > 0) vertices[n-1].z=-vertices[n-1].z; 
										pl=0;
									}else{
										if(pl){
											side.push([pl,nl,yunit,vertices[nl].x-vertices[pl].x]);
											pl=0;
										}
										side.push([n,t-1,-yunit,vertices[t-1].x-vertices[n].x]);
										f= new THREE.Face3( t, t-1,n,null, null, material);
										f.normal.set(0,0,1);
										faces.push(f);
										fUvs.push([
	 										new THREE.Vector2(vertices[t].x,pv),
											new THREE.Vector2(vertices[t-1].x,pv),
											new THREE.Vector2(vertices[n].x,nv)
										]);
									}
									f= new THREE.Face3( t, n,n+1,null, null, material);
									f.normal.set(0,0,1);
									faces.push(f);
									fUvs.push([
	 									new THREE.Vector2(vertices[t].x,pv),
										new THREE.Vector2(vertices[n].x,nv),
										new THREE.Vector2(vertices[n+1].x,nv)
									]);
									checked=1;
								}else{
									f= new THREE.Face3( t-1, t-2,n+1,null, null, material);
									f.normal.set(0,0,1);
									faces.push(f);
									fUvs.push([
	 									new THREE.Vector2(vertices[t-1].x,pv),
										new THREE.Vector2(vertices[t-2].x,pv),
										new THREE.Vector2(vertices[n+1].x,nv)
									]);
									if(vertices[t-2].z > 0){
										side.push([t-2,t-1,0,1]);
									}else{
										vertices[t-2].z=-vertices[t-2].z;
									}
									f= new THREE.Face3( t, t-1,n+1,null, null, material);
									f.normal.set(0,0,1);
									faces.push(f);
									fUvs.push([
	 									new THREE.Vector2(vertices[t].x,pv),
										new THREE.Vector2(vertices[t-1].x,pv),
										new THREE.Vector2(vertices[n+1].x,nv)
									]);
								}
								parent=t;
							}
						}
					}
					if(checked){
						pl=parent;
						nl=n+1;
					}else{
						vertices[n].z=-vertices[n].z;
					}
					n+=2;
					running=0;
				}
			}
			if(pl){
				side.push([pl,nl,yunit,vertices[nl].x-vertices[pl].x]);
				pl=0;
			}
			if(ps){
				for(;ps < pe;ps+=2){
					if(parent < ps && vertices[ps-1].z > 0){
						side.push([ps,ps-1,0,-1]);
					}
					if(vertices[ps].z < 0){
						side.push([ps+1,ps,0,-1]);
						vertices[ps].z=-vertices[ps].z;
					}
				}
			}
 		 }
		 if(pt){
			 for(;pt < n;pt+=2){
				 if(vertices[pt-1].z > 0){
					 side.push([pt,pt-1,0,-1]);
				}
				if(vertices[pt].z < 0){
					side.push([pt+1,pt,0,-1]);
					vertices[pt].z=-vertices[pt].z;
				}
			}
 		 }
		 if(solid){
			 vl=vertices.length;
			 fl=faces.length;
			 ht = z/steps;
			 for(j=0;j!=steps;j++){
				 z -= ht;
				 for(i=0;i!=vl;i++){ 
				 vertices.push(vertices[i].clone().setZ(z));
			}
		}
		pe=steps*vl;
		for(i=0;i!=fl;i++){
			f=faces[i];
 			ff=new THREE.Face3(f.c+pe,f.b+pe,f.a+pe,null, null, material);
 			ff.normal.set(0,0,-1);
 			faces.push(ff);
 			uvs = fUvs[i];
			fUvs.push([
				uvs[2].clone(),
 				uvs[1].clone(),
 				uvs[0].clone()
			]);
		}
		ps = 0;
 		pe = vl;
		for(j=0;j!=steps;j++){
			for(i=0;i!=side.length;i++){
				p=side[i];
 				ef(vertices,faces,fUvs,p[0]+ps,p[1]+ps,p[0]+pe,p[1]+pe,p[2],p[3],j+1,steps,extrudeMaterial);
			}
			ps += vl;
 			pe += vl;
		}
	}
 	this.userdata = { "trace" : side};
};
