
var controls;

function RenderGui() {
	
	controls = {
		gui: null,
		"Debug": false,
		//"run": 0.33
	};
	
	var init = function() {
		
		controls.gui = new dat.GUI();
		
		var actions = controls.gui.addFolder('Actions');
		var settings = controls.gui.addFolder('Settings');
		
		actions.add(controls, "Add Box");
		actions.add(controls, "Add Block");
		actions.add(controls, "Export Bounds");
		
		settings.add(controls, "Debug").onChange(controls.debugChanged);
	};
	
	controls.debugChanged = function() {
		var data = {
			detail: {
				debugToggle: controls['Debug']
			}
		};
		window.dispatchEvent(new CustomEvent('toggle-debug', data));
	};
	
	controls["Add Box"] = function() {
		var addBoxEvent = new CustomEvent('addBox');
		window.dispatchEvent(addBoxEvent);
	};
	
	controls["Add Block"] = function() {
		var addBlockEvent = new CustomEvent('addBlock');
		window.dispatchEvent(addBlockEvent);
	};
	
	controls["Export Bounds"] = function() {
		var exportBoundsEvent = new CustomEvent('exportBounds');
		window.dispatchEvent(exportBoundsEvent);
	};
	
	init.call(this);
}
