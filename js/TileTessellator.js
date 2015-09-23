
function init () {
	TileTessellatorGui = new Gui();
	
	var settings = new TileTessellatorGui.button("Settings", 0, 0);
	$('#container').append(settings.domElement);
	var render = new TileTessellatorGui.button("Render", $(settings.domElement).width()*2, 0);
	$('#container').append(render.domElement);
	var edit = new TileTessellatorGui.button("Edit", 0, $(settings.domElement).height()*2);
	$('#container').append(edit.domElement);
	
	$(edit.domElement).click(function(){
		var prompt = new TileTessellatorGui.prompt();
		
		for(var i=0;i<TileTessellator.voxelBounds.length;i++){
			var index = i;
			var name = TileTessellator.voxelBounds[i].name;
			var coords = TileTessellator.voxelBounds[i].coords;
			var b = new TileTessellatorGui.button(TileTessellator.voxelBounds[i].name, 5, 5 + 30*i);
			var d = new TileTessellatorGui.button("Delete", 80, 5 + 30*i);
			$(d.domElement).css('color', 'Red').click(function(){
				deleteBound(index);
				$(prompt.bg).remove();
				$(prompt.popup).remove();
				$(prompt.close).remove();
			});
			$(b.domElement).click(function(){
				var pop = new TileTessellatorGui.prompt();
				var bound = true;
				$(pop.popup).append('<br/>Bound [0-1] ');
				var toggleBound = new TileTessellatorGui.toggle(pop.popup, 'toggleBound');
				$('#'+toggleBound.id).change(function(){
					bound = !bound;
					if(bound) $(textbox.domElement).attr('placeholder', TileTessellator.voxelBounds[i].coords[0]+', '+TileTessellator.voxelBounds[i].coords[1]+', '+TileTessellator.voxelBounds[i].coords[2]+', '+TileTessellator.voxelBounds[i].coords[3]+', '+TileTessellator.voxelBounds[i].coords[4]+', '+TileTessellator.voxelBounds[i].coords[5]);
					else $(textbox.domElement).attr('placeholder', TileTessellator.voxelBounds[i].coords[0]/16+', '+TileTessellator.voxelBounds[i].coords[1]/16+', '+TileTessellator.voxelBounds[i].coords[2]/16+', '+TileTessellator.voxelBounds[i].coords[3]/16+', '+TileTessellator.voxelBounds[i].coords[4]/16+', '+TileTessellator.voxelBounds[i].coords[5]/16);
				});
				$(pop.popup).append(' Box [0-16]<br/>');
				
				$(pop.popup).append('<br/>Coords: ');
				var coordbox = new TileTessellatorGui.textBox();
				$(coordbox.domElement).attr('placeholder', coords[0]+', '+coords[1]+', '+coords[2]+', '+coords[3]+', '+coords[4]+', '+coords[5]);
				$(pop.popup).append(coordbox.domElement);
				
				$(pop.popup).append('<br/><br/>Texture: ');
				var texturebox = new TileTessellatorGui.textBox();
				$(texturebox.domElement).attr('placeholder', 'planks, 0');
				$(pop.popup).append(texturebox.domElement);
				
				$(pop.popup).append('<br/><br/>Name: ');
				var namebox = new TileTessellatorGui.textBox();
				$(namebox.domElement).attr('placeholder', name);
				$(pop.popup).append(namebox.domElement);
				
				$(pop.popup).append('<br/><br/>');
				var submit = new TileTessellatorGui.button('Edit', 0, 0);
				$(submit.domElement).css('top', '75%').css('left', '35%').css('width', '30%').css('height', '5%');
				$(pop.popup).append(submit.domElement);
				$(submit.domElement).click(function(){
					var coords = $(coordbox.domElement).val().split(',');
					var texI = $(texturebox.domElement).val();
					var texS = texI.split(',');
					var texC;
					if(texS.length == 1){
						texC = [texS[0]];
					}
					else if(texS.length == 2){
						texC = [texS[0], parseInt(texS[1])];
					}
					if(texS.length == 12){
						texC = [texS[0], parseInt(texS[1]), texS[2], parseInt(texS[3]), texS[4], parseInt(texS[5]), texS[6], parseInt(texS[7]), texS[8], parseInt(texS[9]), texS[10], parseInt(texS[11])];
					}
					editBound(index, parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2]), parseFloat(coords[3]), parseFloat(coords[4]), parseFloat(coords[5]), texC, false, bound, $(namebox.domElement).val());
					$(pop.bg).remove();
					$(pop.popup).remove();
					$(pop.close).remove();
					$(prompt.bg).remove();
					$(prompt.popup).remove();
					$(prompt.close).remove();
				});
			});
			$(prompt.popup).append(b.domElement).append(d.domElement);
		}
	});
	
	$(render.domElement).click(function(){
		var prompt = new TileTessellatorGui.prompt();
		
		var bound = true;
		
		$(prompt.popup).append('<br/>Bound [0-1] ');
		var toggleBound = new TileTessellatorGui.toggle(prompt.popup, 'toggleBound');
		$('#'+toggleBound.id).change(function(){
			bound = !bound;
			if(bound) $(textbox.domElement).attr('placeholder', '0, 0, 0, 1, 1, 1');
			else $(textbox.domElement).attr('placeholder', '0, 0, 0, 16, 16, 16');
		});
		$(prompt.popup).append(' Box [0-16]<br/>');
		
		$(prompt.popup).append('<br/>Coords: ');
		var textbox = new TileTessellatorGui.textBox();
		$(textbox.domElement).attr('placeholder', '0, 0, 0, 1, 1, 1');
		$(prompt.popup).append(textbox.domElement);
		
		$(prompt.popup).append('<br/><br/>Texture: ');
		var texbox = new TileTessellatorGui.textBox();
		$(texbox.domElement).attr('placeholder', 'planks, 0');
		$(prompt.popup).append(texbox.domElement);
		
		$(prompt.popup).append('<br/><br/>Name: ');
		var nbox = new TileTessellatorGui.textBox();
		$(nbox.domElement).attr('placeholder', 'box...');
		$(prompt.popup).append(nbox.domElement);
		
		$(prompt.popup).append('<br/><br/>');
		var submit = new TileTessellatorGui.button('Add', 0, 0);
		$(submit.domElement).css('top', '75%').css('left', '35%').css('width', '30%').css('height', '5%');
		$(prompt.popup).append(submit.domElement);
		$(submit.domElement).click(function(){
			var coords = $(textbox.domElement).val().split(',');
			var texI = $(texbox.domElement).val();
			var texS = texI.split(',');
			var texC;
			if(texS.length == 1){
				texC = [texS[0]];
			}
			else if(texS.length == 2){
				texC = [texS[0], parseInt(texS[1])];
			}
			if(texS.length == 12){
				texC = [texS[0], parseInt(texS[1]), texS[2], parseInt(texS[3]), texS[4], parseInt(texS[5]), texS[6], parseInt(texS[7]), texS[8], parseInt(texS[9]), texS[10], parseInt(texS[11])];
			}
			renderBound(parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2]), parseFloat(coords[3]), parseFloat(coords[4]), parseFloat(coords[5]), texC, false, bound, $(nbox.domElement).val());
			$(prompt.bg).remove();
			$(prompt.popup).remove();
			$(prompt.close).remove();
		});
	});
	
	$(settings.domElement).click(function(){
		var prompt = new TileTessellatorGui.prompt();
		
		$(prompt.popup).append('Toggle Base: ');
		var toggleBase = new TileTessellatorGui.toggle(prompt.popup, 'toggleBase');
		if(showBaseMesh) $('#'+toggleBase.id).attr('checked', 'true');
		$('#'+toggleBase.id).change(function(){
			toggleBaseMesh();
		});
		
		$(prompt.popup).append('<br/>Base Texture: ');
		var textbox = new TileTessellatorGui.textBox();
		$(textbox.domElement).attr('placeholder', 'planks, 0');
		$(prompt.popup).append(textbox.domElement);
		$(textbox.domElement).change(function(){
			var texI = $(textbox.domElement).val();
			var texS = texI.split(',');
			var texC;
			if(texS.length == 1){
				texC = [texS[0]];
			}
			else if(texS.length == 2){
				texC = [texS[0], parseInt(texS[1])];
			}
			else if(texS.length == 12){
				texC = [texS[0], parseInt(texS[1]), texS[2], parseInt(texS[3]), texS[4], parseInt(texS[5]), texS[6], parseInt(texS[7]), texS[8], parseInt(texS[9]), texS[10], parseInt(texS[11])];
			}
			baseGeometry = new THREE.CubeGeometry(1, 1, 1, 1, 1, 1);
			setBoundFaces(baseGeometry, texC);
			TileTessellator.scene.remove(baseMesh);
			baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
			baseMesh.position.set(0, -0.5, 0);
			TileTessellator.scene.add(baseMesh);
		});
		
		$(prompt.popup).append('<br/>Toggle Grid: ');
		var toggleGrid = new TileTessellatorGui.toggle(prompt.popup, 'toggleGrid');
		if(TileTessellator.showGrid) $('#'+toggleGrid.id).attr('checked', 'true');
		$('#'+toggleGrid.id).change(function(){
			TileTessellator.toggleHelperGrid();
		});
		
		$(prompt.popup).append('<br/>Toggle Axes: ');
		var toggleAxes = new TileTessellatorGui.toggle(prompt.popup, 'toggleAxes');
		if(TileTessellator.showAxes) $('#'+toggleAxes.id).attr('checked', 'true');
		$('#'+toggleAxes.id).change(function(){
			TileTessellator.toggleHelperAxes();
		});
	});
	
	//terrain
	terrain = TileTessellator.tgaLoader.load('assets/terrain-atlas.tga', function(tex){
		tex.magFilter = THREE.NearestFilter;
		tex.minFilter = THREE.LinearMipMapLinearFilter;
	});
	
	//Add plank base mesh
	baseMaterial = new THREE.MeshLambertMaterial({map: terrain, side: THREE.FrontSide});
	baseGeometry = new THREE.CubeGeometry(1, 1, 1, 1, 1, 1);
	setBoundFaces(baseGeometry, ['planks']);
	baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
	baseMesh.position.set(0, -0.5, 0);
	TileTessellator.scene.add(baseMesh);
}


var Gui = function() {
	_this = this;
	
	_this.prompt = function() {
		var tP = this;
		this.bg = document.createElement('div');
		$(this.bg).addClass('minecraft-bg');
		$('#container').append(this.bg);
		this.popup = document.createElement('div');
		$(this.popup).addClass('minecraft-modal');
		$('#container').append(this.popup);
		this.close = document.createElement('div');
		$(this.close).addClass('minecraft-close').click(function(){
			$(tP.bg).remove();
			$(tP.popup).remove();
			$(tP.close).remove();
			
		});
		$('#container').append(this.close);
	};
	
	_this.textBox = function() {
		this.domElement = $('<input type="text"/>').addClass('minecraft-textInput');
	};
	
	_this.toggle = function(element, id) {
		this.id = id;
		$(element).append('<input id="'+this.id+'" type="checkbox" class="minecraft-toggle"/><label for="'+this.id+'"><span></span></label>');
	};
	
	_this.button = function(text, x, y) {
		this.domElement = document.createElement('div');
		$(this.domElement).addClass('minecraft-btn').css('z-index', '100').css('position', 'absolute').css('left', x + 'px').css('top', y + 'px').html(text);
	};
	
	_this.text = function(text, x, y, fontSize, color) {
		this.color = color || '#DDDDDD';
		this.fontSize = fontSize + 'px' || '12px';
		this.domElement = document.createElement('p');
		$(this.domElement).addClass('minecraft-text').css('color', this.color).css('font-size', this.fontSize).css('z-index', '100').css('position', 'absolute').css('left', y + 'px').css('top', x + 'px').html(text);
	};
};

