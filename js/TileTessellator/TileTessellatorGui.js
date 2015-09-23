
var TileTessellatorGui = function(){
	
	var _this = this;
	
	_this.init = function () {
		var openSettings = new _this.button("Settings", 0, 0);
		$("#container").append(openSettings.domElement);
		$(openSettings.domElement).click(function(){$('#settingScreen').removeAttr('hidden');});
		
		var openRender = new _this.button("Render", $(openSettings.domElement).width()*2, 0);
		$("#container").append(openRender.domElement);
		$(openRender.domElement).click(function(){$('#renderScreen').removeAttr('hidden');});
		
		var Ebound = true;
		
		var openEdit = new _this.button("Edit", $(openSettings.domElement).width()*4, 0);
		$("#container").append(openEdit.domElement);
		$(openEdit.domElement).click(function(){
			$('#editScreen').removeAttr('hidden');
			for(var i=0;i<TileTessellator.voxelBounds.length;i++){
				var index = i;
				var b = new _this.button(TileTessellator.voxelBounds[i].name, 5, 5 + (30 * i));
				$(b.domElement).click(function(){
					$('#editScreen').attr("hidden","true");
					$('#editScreen2').removeAttr('hidden');
					$('#EboundToggle').click(function(){
						Ebound = !Ebound;
						if(!Ebound) {
							$('#EboundToggle').attr('active', 'true').html('Box [0-16]');
							$('#EmaxX').attr('placeholder', '16');
							$('#EmaxY').attr('placeholder', '16');
							$('#EmaxZ').attr('placeholder', '16');
						}
						else if(Ebound) {
							$('#EboundToggle').removeAttr('active').html('Bound [0-1]');
							$('#EmaxX').attr('placeholder', '1');
							$('#EmaxY').attr('placeholder', '1');
							$('#EmaxZ').attr('placeholder', '1');
						}
					});
					//$('#EminX').val(TileTessellator[index].coords[0]);
					//$('#EminY').val(TileTessellator[index].coords[1]);
					//$('#EminZ').val(TileTessellator[index].coords[2]);
					//$('#EmaxX').val(TileTessellator[index].coords[3]);
					//$('#EmaxY').val(TileTessellator[index].coords[4]);
					//$('#EmaxZ').val(TileTessellator[index].coords[5]);
					//$('#Ename').val(TileTessellator[index].name);
					$('#editBound').click(function(){
						var textureArr = $('#Etexture').val().split(',');
						var textureReal;
						if(textureArr.length === 1){
							textureReal = [textureArr[0]];
						}
						if(textureArr.length === 2){
							textureReal = [textureArr[0], parseInt(textureArr[1])];
						}
						if(textureArr.length === 12){
							textureReal = [textureArr[0], parseInt(textureArr[1]), textureArr[2], parseInt(textureArr[3]), textureArr[4], parseInt(textureArr[5]), textureArr[6], parseInt(textureArr[7]), textureArr[8], parseInt(textureArr[9]), textureArr[10], parseInt(textureArr[11]), ];
						}
						editBound(index, parseFloat($('#EminX').val()), parseFloat($('#EminY').val()), parseFloat($('#EminZ').val()), parseFloat($('#EmaxX').val()), parseFloat($('#EmaxY').val()), parseFloat($('#EmaxZ').val()), textureReal, Ebound, $('#Ename').val());
						$('#editScreen2').attr("hidden","true");
					});
				});
				$("#editModal").append(b.domElement);
				var d = new _this.button('Delete', 5 + $(b.domElement).width() * 2, 5 + (30 * i));
				$(d.domElement).css('color','Red').click(function(){
					deleteBound(index);
					$('#editScreen').attr("hidden","true");
				});
				$("#editModal").append(d.domElement);
			}
		});
		
		_this.settingsScreen();
		_this.renderScreen();
		_this.editScreen();
		_this.editScreen2();
	};
	
	_this.settingsScreen = function(){
		$('#settingScreen').load('js/TileTessellator/settingsScreen.xml', function(){
			if(TileTessellator.showAxes) $('#toggleAxes').attr('checked', 'true');
			if(TileTessellator.showGrid) $('#toggleGrid').attr('checked', 'true');
			if(showBaseMesh) $('#toggleBase').attr('checked', 'true');
			$('#toggleAxes').change(function(){TileTessellator.toggleHelperAxes();});
			$('#toggleGrid').change(function(){TileTessellator.toggleHelperGrid();});
			$('#toggleBase').change(function(){toggleBaseMesh();});
			$('#closeSettings').click(function(){
				$('#settingScreen').attr("hidden","true");
			});
		});
	};
	
	var bound = true;
	
	_this.renderScreen = function() {
		$('#renderScreen').load('js/TileTessellator/renderScreen.xml', function(){
			$('#boundToggle').click(function(){
				bound = !bound;
				if(!bound) {
					$('#boundToggle').attr('active', 'true').html('Box [0-16]');
					$('#maxX').attr('placeholder', '16');
					$('#maxY').attr('placeholder', '16');
					$('#maxZ').attr('placeholder', '16');
				}
				else if(bound) {
					$('#boundToggle').removeAttr('active').html('Bound [0-1]');
					$('#maxX').attr('placeholder', '1');
					$('#maxY').attr('placeholder', '1');
					$('#maxZ').attr('placeholder', '1');
				}
			});
			$('#addBound').click(function(){
				var textureArr = $('#texture').val().split(',');
				var textureReal;
				if(textureArr.length === 1){
					textureReal = [textureArr[0]];
				}
				if(textureArr.length === 2){
					textureReal = [textureArr[0], parseInt(textureArr[1])];
				}
				if(textureArr.length === 12){
					textureReal = [textureArr[0], parseInt(textureArr[1]), textureArr[2], parseInt(textureArr[3]), textureArr[4], parseInt(textureArr[5]), textureArr[6], parseInt(textureArr[7]), textureArr[8], parseInt(textureArr[9]), textureArr[10], parseInt(textureArr[11]), ];
				}
				renderBound(parseFloat($('#minX').val()), parseFloat($('#minY').val()), parseFloat($('#minZ').val()), parseFloat($('#maxX').val()), parseFloat($('#maxY').val()), parseFloat($('#maxZ').val()), textureReal, bound, $('#name').val());
				$('#renderScreen').attr("hidden","true");
			});
			$('#closeRender').click(function(){
				$('#renderScreen').attr("hidden","true");
			});
		});
	};
	
	_this.editScreen = function () {
		$('#editScreen').load('js/TileTessellator/editScreen.xml', function(){
			$('#closeEdit').click(function(){
				$('#editScreen').attr("hidden","true");
			});
		});
	};
	
	_this.editScreen2 = function () {
		$('#editScreen2').load('js/TileTessellator/editScreen2.xml', function(){
			$('#closeEdit2').click(function(){
				$('#editScreen2').attr("hidden","true");
			});
		});
	};
	
	_this.button = function(text, x, y) {
		this.domElement = document.createElement('div');
		$(this.domElement).addClass('minecraft-btn').css('z-index', '100').css('position', 'absolute').css('left', x + 'px').css('top', y + 'px').html(text);
	};
};

