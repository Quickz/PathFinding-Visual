(function() {

	class Node
	{
		constructor(gridX, gridY, source, target)
		{
			this.gridX = gridX;
			this.gridY = gridY;

			// distance from starting node
			this.gCost = getCost(this.gridX,
				this.gridY, target);

			// distance from end node
			this.hCost = getCost(this.gridX,
				this.gridY, source);

			this.parent;
			this.neighbours = [];

		}

		get fCost()
		{
			return this.gCost + this.hCost;
		}

	}

	function runSearchAlgorithm()
	{
		var start = new Node(source.x, source.y, source, target);
		start.gCost = 0;
		start.hCost = target.x + target.y - start.gridX - start.gridY - 1;

		// discovered nodes to be evaluated
		var open = [];
		// set of nodes already evaluated
		var closed = [];
		open.push(start);		

		var current;
		while (true)
		{
			// finding lowest f cost
			current = lowestFCost(open);
			// removing current from open list
			open.splice(findIndex(open, current), 1)[0];
			// adding current to closed list
			closed.push(current);

			// path found
			if (current.gridX == target.x &&
				current.gridY == target.y)
			{
				console.log("path found!");
				return current;
			}

			// obtaining neighbors
			current.neighbours = getNeighbours(
				current.gridX, current.gridY);

			// looping through neighbours
			var lng = current.neighbours.length;
			for (let i = 0; i < lng; i++)
			{
				let currNode = current.neighbours[i];
				
				// checking if it's in closed list
				if (findIndex(closed, currNode) >= 0)
					continue;

				// if shorter path found
				var existing = findIndex(open, currNode);
				if (existing >= 0 &&
					open[existing].fCost > currNode.fCost)
				{
					// removing old (bad) node
					open.splice(existing, 1);
				}


				// if shorter or not in open
				if (existing < 0)
				{
					currNode.parent = current;

					// adding neighbour to open nodes
					open.push(currNode);
				}
			}

			// no path found
			if (open.length == 0)
			{
				console.log("path not found");
				return;
			}

		}
	}

	function run()
	{
		var current = runSearchAlgorithm();
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

	// get's g/h cost depending on passed argument
	// x y - current position
	// target - destination
	// returns the distance between current position
	// and the destination target
	function getCost(x, y, target)
	{
		var n1 = Math.abs(target.x - x);
		var n2 =  Math.abs(target.y - y);
		return n1 + n2;
	}

	function getNeighbours(x, y)
	{
		var neighbours = [];
		// top
		if (validCoord(x, y - 1))
			neighbours.push(new Node(x, y - 1, source, target));
		// right
		if (validCoord(x + 1, y))
			neighbours.push(new Node(x + 1, y, source, target));
		// bottom
		if (validCoord(x, y + 1))
			neighbours.push(new Node(x, y + 1, source, target));
		// left
		if (validCoord(x - 1, y))
			neighbours.push(new Node(x - 1, y, source, target));

		return neighbours;
	}
	
	function validCoord(x, y)
	{
			   // inside bounds
		return x >= 0 && x < 20 && y >= 0 && y < 20 &&
			   // walkable
			   coord[x][y] != 2;
	}

	function lowestFCost(nodes)
	{
		var lowest = nodes[0];
		for (let i = 1; i < nodes.length; i++)
		{
			if (nodes[i].fCost < lowest.fCost)
				lowest = nodes[i];
		}
		return lowest;
	}

	function findIndex(nodes, node)
	{
		for (var i = 0; i < nodes.length; i++)
		{
			if (nodes[i].gridX == node.gridX &&
				nodes[i].gridY == node.gridY)
				return i;
		}
		return -1;
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
			// character
			case 1: return "green";
			// wall
			case 2: return "red";
			// path
			case 3: return "lightgreen";
			// target
			case 4: return "blue";
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
		var x = Math.round(e.clientX / 15) - 1;
		var y = Math.round(e.clientY / 15) - 1;
		if (x > 19) x = 19;
		if (y > 19) y = 19;

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

	
	// buttons
	var sourceBtn = document.getElementById("source");
	var targetBtn = document.getElementById("target");
	var wallBtn = document.getElementById("wall");
	var emptyBtn = document.getElementById("empty");
	var runBtn = document.getElementById("run");
	var clearBtn = document.getElementById("clear");

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


	sourceBtn.onclick = () => { selected = 1 };
	targetBtn.onclick = () => { selected = 4 };
	wallBtn.onclick = () => { selected = 2 };
	emptyBtn.onclick = () => { selected = 0 };

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

	// turns off square placement
	mapElm.onmouseup = e => { mousedown = false; };
	mapElm.onmouseout = e => { mousedown = false; };	

	// turns on square placement
	mapElm.onmousedown = e => {
		mousedown = true;
		placeSquare(e);
	};

	mapElm.onmousemove = placeSquare;

})();
