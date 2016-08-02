function editorComponent( container, componentState ) {
	var c = container.getElement();
	$(c).css('overflow-y', 'scroll');
	$(c).css('color','#fff');
	myLayout.on( 'selectBound', function( uuid ) {
		$(c).html('');
		var bound = Bounds[UUIDS.indexOf(uuid)];
		$(c).append('<div class="container" style="margin-top:5px">\
			<div class="row">\
				<div class="col s6 m6 l6">\
					<input type="text" data-modeler="changeable" placeholder="name" value="'+bound.name+'"/>\
				</div>\
				<div class="col s6 m6 l6 center">\
					<div class="btn red" data-modeler="delete">Delete</div>\
				</div>\
			</div>\
			<div class="row">\
				<div class="col s4 m4 l4">\
					<input data-modeler="changeable" type="number" placeholder="x1" value="'+bound.x1+'"/>\
				</div>\
				<div class="col s2 m2 l2">\
					<div value="1" prop="x1" data-modeler="add" class="num-btn">+</div><div value="-1" prop="x1" data-modeler="add" class="num-btn">-</div>\
				</div>\
				<div class="col s4 m4 l4">\
					<input data-modeler="changeable" type="number" placeholder="x2" value="'+bound.x2+'"/>\
				</div>\
				<div class="col s2 m2 l2">\
					<div value="1" prop="x2" data-modeler="add" class="num-btn">+</div><div value="-1" prop="x2" data-modeler="add" class="num-btn">-</div>\
				</div>\
			</div>\
			<div class="row">\
				<div class="col s4 m4 l4">\
					<input data-modeler="changeable" type="number" placeholder="y1" value="'+bound.y1+'"/>\
				</div>\
				<div class="col s2 m2 l2">\
					<div value="1" prop="y1" data-modeler="add" class="num-btn">+</div><div value="-1" prop="y1" data-modeler="add" class="num-btn">-</div>\
				</div>\
				<div class="col s4 m4 l4">\
					<input data-modeler="changeable" type="number" placeholder="y2" value="'+bound.y2+'"/>\
				</div>\
				<div class="col s2 m2 l2">\
					<div value="1" prop="y2" data-modeler="add" class="num-btn">+</div><div value="-1" prop="y2" data-modeler="add" class="num-btn">-</div>\
				</div>\
			</div>\
			<div class="row">\
				<div class="col s4 m4 l4">\
					<input data-modeler="changeable" type="number" placeholder="z1" value="'+bound.z1+'"/>\
				</div>\
				<div class="col s2 m2 l2">\
					<div value="1" prop="z1" data-modeler="add" class="num-btn">+</div><div value="-1" prop="z1" data-modeler="add" class="num-btn">-</div>\
				</div>\
				<div class="col s4 m4 l4">\
					<input data-modeler="changeable" type="number" placeholder="z2" value="'+bound.z2+'"/>\
				</div>\
				<div class="col s2 m2 l2">\
					<div value="1" prop="z2" data-modeler="add" class="num-btn">+</div><div value="-1" prop="z2" data-modeler="add" class="num-btn">-</div>\
				</div>\
			</div>\
		</div>');
		// this allows us to add new events to the selected bound
		$('[data-modeler]').off('click').off('change');
		$('[data-modeler="delete"]').on('click',function(){bound.remove();});
		$('[data-modeler="add"]').on('click',function(){
			bound[$(this).attr('prop')] += parseInt($(this).attr('value'));
			myLayout.emit( 'updateBound', uuid );
			myLayout.emit( 'selectBound', uuid );
		});
		$('[data-modeler="changeable"]').on('change',function(){
			var val = $(this).val();
			if($(this).attr('type') == 'number') val = parseFloat(val);
			bound[$(this).attr('placeholder')] = val;
			myLayout.emit( 'updateBound', uuid );
		});
	});
	myLayout.on( 'deselectBound', function() {
		$(c).html('');
	});
}
