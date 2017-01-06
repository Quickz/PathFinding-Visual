(function() {

	function run()
	{
		var current = AStarSearch.run(source, target, coord);
		var path = findPath(current);
		
		// traveling through the path
		for (let i = 1; i < path.length - 1; i++)
			coord[path[i].x][path[i].y] = 3;

		draw();
	}

	function findPath(node)
	{
		var path = [];
		while (node)
		{
			path.push({ "x": node.gridX, "y": node.gridY });
			node = node.parent;
		}
		console.log("path length: " + path.length);
		return path;
	}

	// fills map acoording to map array contents
	function draw()
	{
		drawSquare(1, 1, "red");
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

	// buttons
	var sourceBtn = document.getElementById("source");
	var targetBtn = document.getElementById("target");
	var wallBtn = document.getElementById("wall");
	var emptyBtn = document.getElementById("empty");
	var runBtn = document.getElementById("run");
	var clearBtn = document.getElementById("clear");
	var controlBtn = document.getElementById("controls");

	var selected = 0;
	var mousedown = false;

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
		run();
	};

	// clears the map
	clearBtn.onclick = () => {
		clearSquare(2);
		clearSquare(3);
		draw();
	};

	controlBtn.onclick = () => {
		alert("1,2,3,4 - Select a Square \n" +
			  "Esc/Del - Clear all \n" +
			  "Enter/Space - Run");
	};

	// turns off square placement
	mapElm.onmouseup = e => { mousedown = false; };
	mapElm.onmouseout = e => { mousedown = false; };	

	// turns on square placement
	mapElm.onmousedown = e => {
		mousedown = true;
		placeSquare(e);
	};

	mapElm.onmousemove = placeSquare;

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
