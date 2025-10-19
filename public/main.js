/*
** KIDZLAB JARDIN D'ESQUISSES
*/
let paths = {};
let pathId = 0;
let currentTempId = null;
let mode = 0; // 0 = draw, 1 = select, 2 = erase, 3 = save svg
let selectedPath = null;
let color = 'red';
let previousMode = 0;

// Only executed our code once the DOM is ready.
window.onload = function() {
	// Get a reference to the canvas object
	var canvas = document.getElementById('myCanvas');
	// Create an empty project and a view for the canvas:
	paper.setup(canvas);
	paper.install(window);
	view.draw();
	
	
	function onMouseDown(event) {
		// console.log("yoooo")
		if (mode == 0) {
			var tempPath = new Path();
			// If we produced a path before, deselect it:
			if (tempPath) {
				tempPath.selected = false;
			}
			
			// Create a new path and set its stroke color to black:
			tempPath = new Path({
				segments: [event.point],
				strokeColor: color,
				strokeWidth: 10,
				strokeCap	: 'round',
				strokeJoin	: 'round',
				// Select the path, so we can see its segment points:
				//fullySelected: true,
				//id: pathId
			});
			console.log("new path id: " + tempPath.id);
			currentTempId = tempPath.id;
			paths[tempPath.id] = tempPath;

			//pathId += 1;
			view.draw();
		} else if (mode == 1) {
			// select path
			var hitResult = paper.project.hitTest(event.point);
			if (hitResult && hitResult.item) {
				if (selectedPath) {
					selectedPath.selected = false;
				}
				selectedPath = hitResult.item;
				selectedPath.selected = true;
			}
		}
	}
	
	// While the user drags the mouse, points are added to the path
	// at the position of the mouse:
	function onMouseDrag(event) {
		if (mode == 0) {
			paths[currentTempId].add(event.point);
			view.draw();
		}
		
		// Update the content of the text item to show how many
		// segments it has:
		//textItem.content = 'Segment count: ' + path.segments.length;
	}
	
	// When the mouse is released, we simplify the path:
	function onMouseUp(event) {
		
		if (mode == 0) {
			//var segmentCount = paths[paths.length - 1].segments.length;
			
			// When the mouse is released, simplify it:
			//paths[paths.length - 1].simplify(10);
			
			// Select the path, so we can see its segments:
			paths[currentTempId].fullySelected = false;
			
			
			view.draw();
			//textItem.content = difference + ' of the ' + segmentCount + ' segments were removed. Saving ' + percentage + '%';
		} else if (mode == 2) {
			// erase path
			// var hitResult = paper.project.hitTest(event.point);
			// if (hitResult && hitResult.item) {
			// 	hitResult.item.remove();
			// }
		}
	}
	
	// Create a new tool and assign the mousedown and mouse drag
	// handlers:
	let tool = new Tool();
	tool.onMouseDown = onMouseDown;
	tool.onMouseDrag = onMouseDrag;
	tool.onMouseUp = onMouseUp;
	
}

function setMode(newMode, col = 'red') {
	mode = newMode;
	//console.log("mode set to " + mode);
	color = col;
	
	// set selected button
	if (mode != 3) {
	const buttons = document.querySelectorAll('input[type="image"]');
	buttons.forEach(button => {
		button.classList.remove('border-4', 'border-yellow-500');
	});
	}
	
	if (mode == 0) {
		const activeButton = document.querySelector(`input[type="image"][onclick*="${col}"]`);
		if (activeButton) {
			activeButton.classList.add('border-4', 'border-yellow-500');
		}
	} else if (mode == 1) {
		const activeButton = document.querySelector(`input[type="image"][onclick*="setMode(${mode})"]`);
		if (activeButton) {
			activeButton.classList.add('border-4', 'border-yellow-500');
		}
	} else if (mode == 2 || mode == 3) {
		
		if (mode == 2) {
			if (selectedPath) {
				
				selectedPath.remove();
				console.log("deleting " + selectedPath.id);
				delete paths[selectedPath.id];
				selectedPath = null;
				mode = 1;
			}

			const activeButton = document.querySelector(`input[type="image"][onclick*="setMode(${1})"]`);
			if (activeButton) {
			 	activeButton.classList.add('border-4', 'border-yellow-500');
			 }
		} else if (mode == 3) {
			// var svg = project.exportSVG({asString:true});
			//console.log(svg);
			// Create a temporary Paper.js Group containing your paths
			const group = new paper.Group(Object.values(paths));
			
			// Export only that group as an SVG string
			//const svgString = group.exportSVG({ asString: true });
			//const svgString = project.exportSVG({ asString: true });
			const svgString = group.exportSVG({ asString: true, bounds: 'content' });
			
			// Clean up the group (remove it from the project)
			//group.remove();
			
			// Create a Blob and trigger download
			const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = "drawing.xml";
			link.click();
			
			// Revoke the URL to free memory
			URL.revokeObjectURL(url);
			
			mode = previousMode;

			// const activeButton = document.querySelector(`input[type="image"][onclick*="setMode(${1)"]`);
			// if (activeButton) {
			// 	activeButton.classList.add('border-4', 'border-yellow-500');
			// }
			
		}
	}
	
	previousMode = mode;
	
}