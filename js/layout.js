var model = new THREE.Group();
var scene, camera, renderer, light, light2, grid;

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

myLayout.registerComponent( 'editor', function( container, componentState ) {
	var c = container.getElement();
	$(c).css('color','#fff');
	myLayout.on( 'selectBound', function( uuid ) {
		var bound = Bounds[UUIDS.indexOf(uuid)];
		// now to do UI stuff
	});
});
myLayout.registerComponent( 'renderer', rendererComponent );
$(document).ready(function(){
	myLayout.init();
	$('body').append('<img id="icon" src="icon.svg" alt="icon"/>');
	$('#icon').css('position','fixed').css('bottom','0').css('right','0').css('z-index','100');
});
window.addEventListener("resize",function(){myLayout.updateSize();});

