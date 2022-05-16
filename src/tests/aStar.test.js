import AStar from '../lib/aStar.mjs';
import Grid from '../lib/grid.mjs';
import {
	euclideanDistance,
	manhattanDistance,
} from '../lib/utils/heuristic.mjs';

test('should be defined', () => {
	expect(AStar).toBeDefined();
});

test('should use specified heuristic algorithm', () => {
	const a = new AStar(new Grid(5, 5), {
		useEuclideanDistanceForHeuristic: true,
	});

	const cell1 = a.grid.getCellAtXY([0, 0]);
	const cell2 = a.grid.getCellAtXY([3, 3]);
	expect(a.heuristic(cell1, cell2)).toBe(euclideanDistance(cell1, cell2));
	expect(a.heuristic(cell1, cell2)).not.toBe(manhattanDistance(cell1, cell2));

	const b = new AStar(new Grid(5, 5), {
		useEuclideanDistanceForHeuristic: false,
	});

	const cell3 = a.grid.getCellAtXY([0, 0]);
	const cell4 = a.grid.getCellAtXY([3, 3]);
	expect(b.heuristic(cell3, cell4)).not.toBe(euclideanDistance(cell3, cell4));
	expect(b.heuristic(cell3, cell4)).toBe(manhattanDistance(cell3, cell4));
});

test('should trace path correctly with start cell', async () => {
	var callbackWasCalled = false;
	var changingPath = [];

	const grid = new Grid(5, 5);
	const aStar = new AStar(grid, {
		tracePathProgressCb: _path => {
			changingPath = _path;
			callbackWasCalled = true;
			_path
				.filter((_, i) => i > 0)
				.forEach((cell, i) => {
					expect(grid.areNeighbors(cell, _path[i])).toBe(true);
					expect(cell.isVisited).toBe(true);
				});
		},
	});

	const start = grid.getCellAtXY([0, 0]);
	const end = grid.getCellAtXY([0, 4]);

	const path = await aStar.findPath(start, end);

	expect(callbackWasCalled).toBe(true);
	expect(changingPath).toEqual(path);
	expect(path[0]).toEqual(start);
	expect(path[path.length - 1]).toEqual(end);
});

test('should trace path correctly without start cell', async () => {
	const grid = new Grid(5, 5);
	const aStar = new AStar(grid, {
		includesStartCellInPath: false,
		tracePathProgressCb: _path => {
			changingPath = _path;
			callbackWasCalled = true;
			_path
				.filter((_, i) => i > 0)
				.forEach((cell, i) => {
					expect(grid.areNeighbors(cell, _path[i])).toBe(true);
					expect(cell.isVisited).toBe(true);
				});
		},
	});

	const start = grid.getCellAtXY([0, 0]);
	const end = grid.getCellAtXY([0, 4]);

	var callbackWasCalled = false;
	var changingPath = [];

	const path = await aStar.findPath(start, end);

	expect(callbackWasCalled).toBe(true);
	expect(changingPath).toEqual(path);
	expect(path[0]).not.toEqual(start);
	expect(grid.areNeighbors(path[0], start)).toBe(true);
	expect(path[path.length - 1]).toEqual(end);
});

test('should find correct path with diagonal neighbors', async () => {
	const grid = new Grid(5, 5);
	const aStar = new AStar(grid);

	const start = grid.getCellAtXY([0, 0]);
	const end = grid.getCellAtXY([0, 4]);
	const path = await aStar.findPath(start, end);

	expect(path[0]).toEqual(start);
	expect(path[path.length - 1]).toEqual(end);
	path
		.filter((_, i) => i > 0)
		.forEach((cell, i) => {
			expect(grid.areNeighbors(cell, path[i])).toBe(true);
			expect(cell.isVisited).toBe(true);
		});
});

test('should find correct path without diagonal neighbors', async () => {
	const grid = new Grid(5, 5, { allowDiagonalNeighbors: false });
	const aStar = new AStar(grid);

	const start = grid.getCellAtXY([4, 0]);
	const end = grid.getCellAtXY([0, 4]);
	const path = await aStar.findPath(start, end);

	expect(path[0]).toEqual(start);
	expect(path[path.length - 1]).toEqual(end);
	path
		.filter((_, i) => i > 0)
		.forEach((cell, i) => {
			expect(grid.areNeighbors(cell, path[i])).toBe(true);
			expect(cell.isVisited).toBe(true);
		});
});

test('should find correct path with diagonal neighbors and obstacles', async () => {
	const grid = new Grid(5, 5, { allowDiagonalNeighbors: true });
	const aStar = new AStar(grid);

	let start = grid.getCellAtXY([4, 0]);
	let end = grid.getCellAtXY([0, 4]);

	grid.getCellAtXY([2, 2]).setIsObstacle(true).data = '  -  ';
	grid.getCellAtXY([1, 1]).setIsObstacle(true).data = '  -  ';
	grid.getCellAtXY([3, 4]).setIsObstacle(true).data = '  -  ';

	const path = await aStar.findPath(start, end);

	expect(path[0]).toEqual(start);
	expect(path[path.length - 1]).toEqual(end);
	path
		.filter((_, i) => i > 0)
		.forEach((cell, i) => {
			expect(grid.areNeighbors(cell, path[i])).toBe(true);
			expect(cell.isVisited).toBe(true);
		});
});

test('should find correct path without diagonal neighbors and with obstacles', async () => {
	const grid = new Grid(5, 5, { allowDiagonalNeighbors: false });
	const aStar = new AStar(grid);

	let start = grid.getCellAtXY([4, 0]);
	let end = grid.getCellAtXY([0, 4]);

	grid.getCellAtXY([2, 2]).setIsObstacle(true).data = '  -  ';
	grid.getCellAtXY([1, 1]).setIsObstacle(true).data = '  -  ';
	grid.getCellAtXY([3, 4]).setIsObstacle(true).data = '  -  ';

	const path = await aStar.findPath(start, end);

	expect(path[0]).toEqual(start);
	expect(path[path.length - 1]).toEqual(end);
	path
		.filter((_, i) => i > 0)
		.forEach((cell, i) => {
			expect(grid.areNeighbors(cell, path[i])).toBe(true);
			expect(cell.isVisited).toBe(true);
		});
});
