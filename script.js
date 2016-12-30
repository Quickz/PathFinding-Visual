(function() {

	// map
	var coord = [];
	for (let i = 0; i < 20; i++)
	{
		coord[i] = [];
		for (let j = 0; j < 20; j++)
			coord[i][j] = 0;
	}

	var mapElm = document.getElementById("map");
	var map = mapElm.getContext("2d");

	var curr = { "x": 0, "y": 0 };
	var target = { "x": 19, "y": 19 };
	// character
	coord[curr.x][curr.y] = 1;
	// target
	coord[target.x][target.y] = 4;


	class Node
	{
		constructor(walkable, gridX, gridY)
		{
			// tells you if the position is walkable
			// is it a wall and stuff basically
			this.walkable = walkable;


			// ????
			// point in the world the node represents
			//this.worldPosition = worldPosition;
			// ???

			this.gridX = gridX;
			this.gridY = gridY;

			// distance from starting node
			this.gCost;
			// distance from end node
			this.hCost;
			this.parent;
			this.neighbours = [];
			//this.heapIndex;

			this.calculateCosts(curr, target);
		}

		get fCost()
		{
			return this.gCost + this.hCost;
		}

		calculateCosts(source, target)
		{
			this.hCost = getCost(this.gridX,
				this.gridY, source);
			this.gCost = getCost(this.gridX,
				this.gridY, target);
		}

	}

	function runSearchAlgorithm()
	{
		var antistuck = 0;

		var start = new Node(true, curr.x, curr.y);
		start.gCost = 0;
		start.hCost = target.x + target.y - start.gridX - start.gridY - 1;
		//console.log(start.gCost + " " + start.hCost);

		// discovered nodes to be evaluated
		var open = [];
		// set of nodes already evaluated
		var closed = [];
		open.push(start);
		/*
		var a = new Node(true, 4, 3);
		open.push(a);
		var b = new Node(true, 3, 3);
		//open.push(b);*/
		

		// arr.splice(indextoget, howmany(usually 1))

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
				// would be return in a function
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
				
				// checking if not walkable or closed
				if (!currNode.walkable ||
					findIndex(closed, currNode) >= 0)
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
				// set fcost of neighbour
				// set parent of neighbour
				//if neighbour is not in open
				//	add to open


			}
			//break;



			antistuck++;
			if (antistuck > 999999) break;
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
			console.log(node.gridX + " " + node.gridY);
			path.push({ "x": node.gridX, "y": node.gridY });
			node = node.parent;
		}console.log(path.length);
		return path;
	}

	//console.log(getCost(4, 4, { "x": 4, "y": 3 }));
	//console.log(getCost(2, 4, curr));
	// get's g/h cost depending on passed argument
	// x y - current position
	// target - destination
	// returns the distance between current position
	// and the destination target
	function getCost(x, y, target)
	{
		var n1 = Math.abs(target.x - x);
		var n2 =  Math.abs(target.y - y);
		//console.log(n1 + " " + n2);
		//console.log(n1 + n2);
		return n1 + n2;
	}

	function getNeighbours(x, y)
	{
		var neighbours = [];
		// top
		if (validCoord(x, y - 1))
			neighbours.push(new Node(true, x, y - 1));
		// right
		if (validCoord(x + 1, y))
			neighbours.push(new Node(true, x + 1, y));
		// bottom
		if (validCoord(x, y + 1))
			neighbours.push(new Node(true, x, y + 1));
		// left
		if (validCoord(x - 1, y))
			neighbours.push(new Node(true, x - 1, y));

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

	draw();

	var selected = 0;
	var source = document.getElementById("source");
	var targetBtn = document.getElementById("target");
	var wall = document.getElementById("wall");
	var empty = document.getElementById("empty");
	var clear = document.getElementById("clear");
	var runBtn = document.getElementById("run");

	runBtn.onclick = () => {
		// cleans old path
		clearSquare(3);
		run();
	};

	source.onclick = () => { selected = 1 };
	targetBtn.onclick = () => { selected = 4 };
	wall.onclick = () => { selected = 2 };
	empty.onclick = () => { selected = 0 };
	clear.onclick = () => {
		clearSquare(2);
		clearSquare(3);
		draw();
	};

	mapElm.onclick = (e) => {
		// obtaining coordinates
		var x = Math.round(e.clientX / 15) - 1;
		var y = Math.round(e.clientY / 15) - 1;
		//alert(x + " " + y);

		// can't erase source/target
		// can only have it's location changed
		if (target.x == x && target.y == y &&
			selected != 4 || selected != 1 &&
			curr.x == x && curr.y == y)
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
			curr.x = x;
			curr.y = y;
		}

		coord[x][y] = selected;

		draw();
	};


})();
