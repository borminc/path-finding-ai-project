function euclideanDistance(cell1, cell2) {
	const a = cell1.getXY();
	const b = cell2.getXY();
	return (
		a
			.map((x, i) => Math.abs(x - b[i]) ** 2) // square the difference
			.reduce((sum, now) => sum + now) ** // sum
		(1 / 2) // sqrt
	);
}

function manhattanDistance(cell1, cell2) {
	var d1 = Math.abs(cell2.x - cell1.x);
	var d2 = Math.abs(cell2.y - cell1.y);
	return d1 + d2;
}

module.exports = { euclideanDistance, manhattanDistance };
