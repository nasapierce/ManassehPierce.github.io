var config = {
	settings:{
        hasHeaders: true,
        constrainDragToContainer: true,
        reorderEnabled: false,
        selectionEnabled: false,
        popoutWholeStack: false,
        blockedPopoutsThrowError: true,
        closePopoutsOnUnload: true,
        showPopoutIcon: false,
        showMaximiseIcon: false,
        showCloseIcon: false
    }, content: [{
		type: 'column',
		content: [{
			type: 'component',
			componentName: 'renderer',
			componentState: {},
			content: [],
			id: 'renderer',
			width: 100,
			height: 50,
			isClosable: false,
			title: 'Renderer',
			activeItemIndex: 1
		},{
			type: 'component',
			componentName: 'editor',
			componentState: {},
			title: 'Editor'
		}]
    }]
};

var myLayout = new GoldenLayout( config, $("#container") );

myLayout.registerComponent( 'editor', editorComponent );
myLayout.registerComponent( 'renderer', rendererComponent );

myLayout.on( 'updateBound', function( uuid ) {
	if( selectedMesh ) scene.remove( selectedMesh );
	var bound = Bounds[UUIDS.indexOf(uuid)];
	bound.updateSize();
	selectedMesh = new THREE.EdgesHelper( bound.mesh, 0xff0000 );
	scene.add( selectedMesh );
});

var stacksCreated = 0;

myLayout.on( 'stackCreated', function( stack ) {
	if(stacksCreated == 0) {
		stack.header.controlsContainer.prepend( '<span id="addbound" class="stack-btn"><img src="images/addbound.png"/></span>' );
		stack.header.controlsContainer.prepend( '<span id="export" class="stack-btn"><img src="images/export.png"/></span>' );
		stack.header.controlsContainer.prepend( '<span id="import" class="stack-btn"><img src="images/import.png"/></span>' );
	} else {
		stack.header.controlsContainer.prepend( '<span id="mv-up" class="mv-btn">Up</span>' );
		stack.header.controlsContainer.prepend( '<span id="mv-down" class="mv-btn">Down</span>' );
		stack.header.controlsContainer.prepend( '<span id="mv-north" class="mv-btn">North</span>' );
		stack.header.controlsContainer.prepend( '<span id="mv-south" class="mv-btn">South</span>' );
		stack.header.controlsContainer.prepend( '<span id="mv-east" class="mv-btn">East</span>' );
		stack.header.controlsContainer.prepend( '<span id="mv-west" class="mv-btn">West</span>' );
	}
	stacksCreated++;
});

myLayout.on( 'initialised', function() {
	$('#addbound').click(function() {
		var b = new Bound( 0, 0, 0, 16, 16, 16 );
		selectedBound = b;
		myLayout.emit( 'selectBound', b.uuid );
		myLayout.emit( 'updateBound', b.uuid );
	});
	
	$('#mv-up').on('click',function(){
		if(selectedBound) {
			selectedBound.y1 += 1;
			selectedBound.y2 += 1;
			myLayout.emit( 'updateBound', selectedBound.uuid );
			myLayout.emit( 'selectBound', selectedBound.uuid );
		}
	});
	$('#mv-down').on('click',function(){
		if(selectedBound) {
			selectedBound.y1 -= 1;
			selectedBound.y2 -= 1;
			myLayout.emit( 'updateBound', selectedBound.uuid );
			myLayout.emit( 'selectBound', selectedBound.uuid );
		}
	});
	$('#mv-north').on('click',function(){
		if(selectedBound) {
			selectedBound.z1 -= 1;
			selectedBound.z2 -= 1;
			myLayout.emit( 'updateBound', selectedBound.uuid );
			myLayout.emit( 'selectBound', selectedBound.uuid );
		}
	});
	$('#mv-south').on('click',function(){
		if(selectedBound) {
			selectedBound.z1 += 1;
			selectedBound.z2 += 1;
			myLayout.emit( 'updateBound', selectedBound.uuid );
			myLayout.emit( 'selectBound', selectedBound.uuid );
		}
	});
	$('#mv-east').on('click',function(){
		if(selectedBound) {
			selectedBound.x1 -= 1;
			selectedBound.x2 -= 1;
			myLayout.emit( 'updateBound', selectedBound.uuid );
			myLayout.emit( 'selectBound', selectedBound.uuid );
		}
	});
	$('#mv-west').on('click',function(){
		if(selectedBound) {
			selectedBound.x1 += 1;
			selectedBound.x2 += 1;
			myLayout.emit( 'updateBound', selectedBound.uuid );
			myLayout.emit( 'selectBound', selectedBound.uuid );
		}
	});
});

$(document).ready(function(){
	myLayout.init();
	$('body').append('<img id="icon" src="icon.svg" alt="icon"/>');
	$('#icon').css('position','fixed').css('bottom','0').css('right','0').css('z-index','100');
});

window.addEventListener("resize",function(){myLayout.updateSize();});

