
class Node
{
	constructor(gridX, gridY, source, target)
	{
		this.gridX = gridX;
		this.gridY = gridY;

		// distance from starting node
		this.gCost = this.getCost(this.gridX,
			this.gridY, target);

		// distance from end node
		this.hCost = this.getCost(this.gridX,
			this.gridY, source);

		this.nodeParent;
		this.neighbours = [];

	}

	get fCost()
	{
		return this.gCost + this.hCost;
	}

	set parent(p)
	{
		// recalculating the costs
		// based on parent's path
		var dif = p.gCost - this.gCost;
		this.gCost = p.gCost +(dif > 0 ? 1 : dif < 0 ? -1 : 0);

		dif = p.hCost - this.hCost;
		this.hCost = p.hCost + (dif > 0 ? 1 : dif < 0 ? -1 : 0);

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
