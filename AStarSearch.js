
const AStarSearch = {

	/*
	 * - - - Algorithm - - -
	*/
	run: function(source, target, grid)
	{
		// saving grid so the methods can access it
		this.grid = grid;

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
			current = this.lowestCost(open);
			// removing current from open list
			open.splice(this.findIndex(open, current), 1)[0];
			// adding current to closed list
			closed.push(current);

			// path found
			if (current.gridX == target.x &&
				current.gridY == target.y)
			{
				console.log("path found!");
				closed = closed.concat(open);
				return { "path": current, "visited": closed };
			}

			// obtaining neighbors
			current.neighbours = this.getNeighbours(
				current.gridX, current.gridY, source, target);

			// looping through neighbours
			var lng = current.neighbours.length;
			for (let i = 0; i < lng; i++)
			{
				let currNode = current.neighbours[i];
				
				// checking if it's in closed list
				if (this.findIndex(closed, currNode) >= 0)
					continue;

				// if shorter path found
				var existing = this.findIndex(open, currNode);
				if (existing >= 0 &&
					open[existing].fCost >= currNode.fCost &&
					open[existing].gCost > currNode.gCost)
				{

					// removing old (bad) node
					open.splice(existing, 1);

				}

				// not in open
				if (this.findIndex(open, currNode) < 0)
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
	},

	/*
	 * - - - Methods - - -
	*/

	lowestCost: function(nodes)
	{
		var lowest = nodes[0];
		for (let i = 1; i < nodes.length; i++)
		{
			if (nodes[i].fCost <= lowest.fCost &&
				nodes[i].hCost < lowest.hCost)
				lowest = nodes[i];
		}
		return lowest;
	},

	findIndex: function(nodes, node)
	{
		for (var i = 0; i < nodes.length; i++)
		{
			if (nodes[i].gridX == node.gridX &&
				nodes[i].gridY == node.gridY)
				return i;
		}
		return -1;
	},

	validCoord: function(x, y)
	{
			   // inside bounds
		return x >= 0 && x < this.grid.length &&
			   y >= 0 && y < this.grid.length &&
			   // walkable
			   this.grid[x][y] != 2;
	},

	getNeighbours: function(x, y, source, target)
	{
		var neighbours = [];
		// top
		if (this.validCoord(x, y - 1))
			neighbours.push(new Node(x, y - 1, source, target));
		// right
		if (this.validCoord(x + 1, y))
			neighbours.push(new Node(x + 1, y, source, target));
		// bottom
		if (this.validCoord(x, y + 1))
			neighbours.push(new Node(x, y + 1, source, target));
		// left
		if (this.validCoord(x - 1, y))
			neighbours.push(new Node(x - 1, y, source, target));

		return neighbours;
	}

};
