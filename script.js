(function() {

	function run()
	{
		consoleDiv.innerHTML = "Loading . . .";
		var current = AStarSearch.run(source, target, coord);
		
		// path not found
		if (!current)
		{
			draw();
			consoleDiv.innerHTML = "Path not found";
			return;
		}

		var path = findPath(current.path);
		var visited = findVisited(current.visited);

		// information about the pathfinding process
		var feedback = "Path length: " + (path.length - 1) + "<br>";
		feedback += "Squares discovered: " + (visited.length + 1);
		consoleDiv.innerHTML = feedback;

		// starting animation
		if (animCheckBox.checked)
		{
			runPathAnimation(path, visited, 10);
			draw();
		}
		// outputting results instantly
		else
		{
			// traveling through discovered nodes
			for (let i = 0; i < visited.length; i++)
				coord[visited[i].x][visited[i].y] = 5;

			// traveling through the path
			for (let i = 1; i < path.length - 1; i++)
				coord[path[i].x][path[i].y] = 3;
			
			draw();
			drawPathLine(path);
		}

	}

	function runPathAnimation(path, visited, speed)
	{

		// aborting previous animation
		// if there's any
		clearTimeout(animTimeout);

		animating = true;

		// animating visited nodes
		animate(visited, 5, speed, function(){

			/**
			 * removing temporarily to avoid 
			 * coloring the target
			 */
			let lastElement = path.pop();

			// animating the path
			animate(path, 3, speed, function() {

				// re-adding for the line
				path.push(lastElement);

				drawPathLine(path);
				animating = false;

			});

		}, 0);
	}

	function animate(path, colorNumber, speed, callback, index = 1)
	{
		// checking for the end
		if (index >= path.length)
		{
			if (callback)
				callback();
			return;
		}

		// processing
		coord[path[index].x][path[index].y] = colorNumber;
		index++;
		draw();

		// repeating the process
		animTimeout = setTimeout(function(){
			animate(path, colorNumber, speed, callback, index);
		}, speed);
	}

	function findPath(node)
	{
		var path = [];
		while (node)
		{
			path.push({ "x": node.gridX, "y": node.gridY });
			node = node.parent;
		}

		// reversing path to it's initial direction
		path.reverse();

		return path;
	}

	function findVisited(nodes)
	{
		var visited = [];
		for (let i = 0; i < nodes.length; i++)
		{
			let x = nodes[i].gridX;
			let y = nodes[i].gridY;
			if ( (x != target.x || y != target.y) &&
				 (x != source.x || y != source.y) )
				visited.push({ "x": x, "y": y });
		}
		return visited;
	}

	function mapClear()
	{
		map.clearRect(0, 0, mapElm.width, mapElm.height);
	}

	// fills map according to map array contents
	function draw()
	{
		mapClear();
		for (let i = 0; i < 20; i++)
		{
			for (let j = 0; j < 20; j++)
			{
				let color = getColor(coord[i][j]);
				drawSquare(i, j, color);
			}
		}
	}

	function getColor(number)
	{
		switch (number)
		{
			// character - green
			case 1: return "#4caf50";
			// wall - red
			case 2: return "#f44336";
			// path
			case 3: return "lightgreen";
			// target - blue
			case 4: return "#2196F3";
			// visited squares
			case 5: return "#cdffcc";
			// empty square
			default: return "white";
		}
	}

	// fills a square at specified coordinate
	function drawSquare(x, y, color)
	{
		map.fillStyle = color;
		map.fillRect(2 + 15 * x, 2 + 15 * y, 13, 13);
	}

	// clears all squares of specific color
	function clearSquare(number)
	{
		for (let i = 0; i < 20; i++)
		{
			for (let j = 0; j < 20; j++)
			{
				if (coord[i][j] == number)
					coord[i][j] = 0;
			}
		}
	}

	// places a square on mouse location
	function placeSquare(e)
	{
		if (!mousedown)
			return;
		
		// obtaining coordinates
		var x = Math.ceil((e.clientX - mapElm.offsetLeft) / 15) - 1;
		var y = Math.ceil((e.clientY - mapElm.offsetTop) / 15) - 1;
		
		// preventing coordinates from going
		// out of bounds
		x = x > 19 ? 19 : x < 0 ? 0 : x;
		y = y > 19 ? 19 : y < 0 ? 0 : y;

		// can't erase source/target
		// can only have it's location changed
		if (target.x == x && target.y == y &&
			selected != 4 || selected != 1 &&
			source.x == x && source.y == y)
			return;

		// deleting old source/target
		// and changing to a new one
		if (selected == 4)
		{
			clearSquare(selected);
			target.x = x;
			target.y = y;
		}
		else if (selected == 1)
		{
			clearSquare(selected);
			source.x = x;
			source.y = y;
		}

		coord[x][y] = selected;
		draw();
	}

	function selectSquare(n)
	{
		var btn;
		switch(n)
		{
			case 0: btn = emptyBtn; break;
			case 1: btn = sourceBtn; break;
			case 2: btn = wallBtn; break;
			case 4: btn = targetBtn; break;
		}

		emptyBtn.style.borderColor = "#c3c3c3";
		sourceBtn.style.borderColor = "#c3c3c3";
		wallBtn.style.borderColor = "#c3c3c3";
		targetBtn.style.borderColor = "#c3c3c3";

		btn.style.borderColor = "#F57F17";
		selected = n;
	}

	function drawLine(line, x = 0, y = 0)
	{
		switch (line)
		{
			case "horizontal":
				genLine(x, y, 0, 7, 17, 7);
				break;
			case "vertical":
				genLine(x, y, 8, -2, 8, 15);
				break;
			case "rightDown":

				// x
				genLine(x, y, 0, 7, 8, 7);

				// y
				genLine(x, y, 8, 4, 8, 15);

				break;
			case "upRight":

				// x
				genLine(x, y, 8, 7, 17, 7);

				// y
				genLine(x, y, 8, 4, 8, 15);

				break;
			case "downRight":

				// x
				genLine(x, y, 8, 7, 17, 7);

				// y
				genLine(x, y, 8, -2, 8, 10);

				break;
			case "rightUp":

				// x
				genLine(x, y, 0, 7, 8, 7);

				// y
				genLine(x, y, 8, -2, 8, 10);

				break;
		}
	}

	function genLine(x, y, posx, posy, tarx, tary)
	{
		x = 15 * x;
		y = 2 + 15 * y;

		map.beginPath();

		map.strokeStyle = "orange";
		map.lineWidth = 5;

		map.moveTo(x + posx, y + posy);
		map.lineTo(x + tarx, y + tary);

		map.stroke();
	}

	function drawPathLine(path)
	{

		var oldx, oldy;
		for (let i = 0; i < path.length - 1; i++)
		{
			let x = path[i].x;
			let y = path[i].y;
			
			if (oldx != null)
			{
				let nextx = path[i + 1].x;
				let nexty = path[i + 1].y;

				if (rightDownL(oldx, oldy, x, y, nextx, nexty))
					drawLine("rightDown", x, y);
				else if (upRightL(oldx, oldy, x, y, nextx, nexty))
					drawLine("upRight", x, y);
				else if (downRightL(oldx, oldy, x, y, nextx, nexty))
					drawLine("downRight", x, y);
				else if (rightUpL(oldx, oldy, x, y, nextx, nexty))
					drawLine("rightUp", x, y);
				else
					checkForHorVerLine(x, y, oldx, oldy);
			}

			oldx = x;
			oldy = y;
		}

	}

	function checkForHorVerLine(x, y, oldx, oldy)
	{
		if (checkVerL(x, y, oldx, oldy))
			drawLine("vertical", x, y);
		else if (checkHorL(x, y, oldx, oldy))
			drawLine("horizontal", x, y);
	}



	/**
	 * boolean functions for determining
	 * what sort of a line to draw in a square
	 */

	function checkVerL(x, y, oldx, oldy)
	{
		return x == oldx && (y > oldy || y < oldy);
	}

	function checkHorL(x, y, oldx, oldy)
	{
		return y == oldy && (x > oldx || x < oldx);
	}

	function rightDownL(oldx, oldy, x, y, nextx, nexty)
	{
		return oldx < x && nextx == x && nexty > y ||
			   nextx < x && oldx == x && oldy > y;
	}

	function upRightL(oldx, oldy, x, y, nextx, nexty)
	{
		return oldy > y && nexty == y && nextx > x ||
			   nexty > y && oldy == y && oldx > x;
	}

	function downRightL(oldx, oldy, x, y, nextx, nexty)
	{
		return oldy < y && nexty == y && nextx > x ||
			   nexty < y && oldy == y && oldx > x;
	}

	function rightUpL(oldx, oldy, x, y, nextx, nexty)
	{
		return oldx < x && nextx == x && nexty < y ||
			   nextx < x && oldx == x && oldy < y;
	}


	// buttons
	var sourceBtn = document.getElementById("source");
	var targetBtn = document.getElementById("target");
	var wallBtn = document.getElementById("wall");
	var emptyBtn = document.getElementById("empty");
	var runBtn = document.getElementById("run");
	var clearBtn = document.getElementById("clear");
	var controlBtn = document.getElementById("controls");

	var animCheckBox = document.getElementById("anim-check");
	var consoleDiv = document.getElementById("console");

	var selected = 0;
	var mousedown = false;

	// contains timeout responsible
	// for path animation
	var animTimeout;

	// tells if animation is in progress
	var animating = false;

	// generating empty coordinates for the grid
	var coord = [];
	for (let i = 0; i < 20; i++)
	{
		coord[i] = [];
		for (let j = 0; j < 20; j++)
			coord[i][j] = 0;
	}

	var mapElm = document.getElementById("map");
	var map = mapElm.getContext("2d");

	// character
	var source = { "x": 0, "y": 0 };
	coord[source.x][source.y] = 1;
	// target
	var target = { "x": 19, "y": 19 };
	coord[target.x][target.y] = 4;

	draw();

	sourceBtn.onclick = () => {
		selectSquare(1);
	};
	targetBtn.onclick = () => {
		selectSquare(4);
	};
	wallBtn.onclick = () => {
		selectSquare(2);
	};
	emptyBtn.onclick = () => {
		selectSquare(0);
	};

	// runs the algorithm
	runBtn.onclick = () => {

		// cleans old path
		clearSquare(3);
		clearSquare(5);

		// searching a new one
		run();

	};

	// clears the map
	clearBtn.onclick = () => {
		
		// cancelling animation
		clearTimeout(animTimeout);
		animating = false;

		// cleaning console
		consoleDiv.innerHTML = "";

		clearSquare(2);
		clearSquare(3);
		clearSquare(5);
		draw();
	};

	controlBtn.onclick = () => {

		if (animating)
			return;

		alert("1,2,3,4 - Select a Square \n" +
			  "Esc/Del - Clear all \n" +
			  "Enter/Space - Run");
	};

	// turns off square placement
	mapElm.onmouseup = e => { mousedown = false; };
	mapElm.onmouseout = e => { mousedown = false; };	

	// turns on square placement
	mapElm.onmousedown = e => {

		if (animating)
			return;

		mousedown = true;
		placeSquare(e);
	};

	mapElm.onmousemove = e => {
		
		if (animating)
			return;

		placeSquare(e);
	};

	// controls
	document.onkeydown = e => {

		switch (e.keyCode)
		{
			// 1
			case 49:
				selectSquare(1);
				break;
			// 2
			case 50:
				selectSquare(4);
				break;
			// 3
			case 51:
				selectSquare(2);
				break;
			// 4
			case 52:
				selectSquare(0);
				break;
			// space
			case 32:
			// enter
			case 13:
				e.preventDefault();
				runBtn.click();
				break;
			// esc
			case 27:
			// del
			case 46:
				clearBtn.click();
				break;
		}
	}
 
})();
