
class Node
{
	constructor(gridX, gridY, source, target)
	{
		this.gridX = gridX;
		this.gridY = gridY;
		
		// distance from starting node
		this.gCost = 0;

		// distance from end node
		this.hCost = this.getCost(this.gridX,
			this.gridY, target);

		this.nodeParent;
		this.neighbours = [];

	}

	get fCost()
	{
		return this.gCost + this.hCost;
	}

	set parent(p)
	{
		// calculating the cost
		// based on parent's path
		this.gCost = p.gCost + 1;

		// setting parent
		this.nodeParent = p;
	}

	get parent()
	{
		return this.nodeParent;
	}

	// get's g/h cost depending on passed argument
	// x y - current position
	// target - destination
	// returns the distance between current position
	// and the destination target
	getCost(x, y, target)
	{
		var n1 = Math.abs(target.x - x);
		var n2 =  Math.abs(target.y - y);
		return n1 + n2;
	}

}
