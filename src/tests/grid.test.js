import Cell from '../lib/cell.mjs';
import Grid from '../lib/grid.mjs';

test('should be defined', () => {
	expect(Grid).toBeDefined();
});

test('should create a grid with correct coordinates', () => {
	const grid = new Grid(5, 5);

	const res = [
		['(0,0)', '(1,0)', '(2,0)', '(3,0)', '(4,0)'],
		['(0,1)', '(1,1)', '(2,1)', '(3,1)', '(4,1)'],
		['(0,2)', '(1,2)', '(2,2)', '(3,2)', '(4,2)'],
		['(0,3)', '(1,3)', '(2,3)', '(3,3)', '(4,3)'],
		['(0,4)', '(1,4)', '(2,4)', '(3,4)', '(4,4)'],
	];

	expect(grid.cells.map(row => row.map(c => c.getXYString()))).toEqual(res);
});

test('should get correct neighbors', () => {
	const grid = new Grid(5, 5);

	expect(grid.getNeighborCells).toBeDefined();

	const neighbors = grid.getNeighborCells([1, 2]);
	expect(neighbors).toBeInstanceOf(Array);
	neighbors.forEach(neighbor => expect(neighbor).toBeInstanceOf(Cell));
	expect(neighbors).toEqual(grid.getNeighborCells(grid.cells[2][1]));
	expect(neighbors).toEqual(grid.getNeighborCells(grid.getCellAtXY([1, 2])));

	expect(neighbors.map(c => c.getXYString())).toEqual([
		'(0,1)',
		'(1,1)',
		'(2,1)',
		'(2,2)',
		'(2,3)',
		'(1,3)',
		'(0,3)',
		'(0,2)',
	]);

	expect(grid.getNeighborCells([0, 0]).map(c => c.getXYString())).toEqual([
		'(1,0)',
		'(1,1)',
		'(0,1)',
	]);

	// no diagonal neighbors
	const grid2 = new Grid(5, 5, { allowDiagonalNeighbors: false });
	expect(grid2.getNeighborCells([0, 0]).map(c => c.getXYString())).toEqual([
		'(1,0)',
		'(0,1)',
	]);
	expect(grid2.getNeighborCells([1, 2]).map(c => c.getXYString())).toEqual([
		'(1,1)',
		'(2,2)',
		'(1,3)',
		'(0,2)',
	]);
});

test('should determine if two cells are neighbors', () => {
	const grid = new Grid(5, 5);

	const cell1 = grid.getCellAtXY([1, 1]);
	const cell2 = grid.getCellAtXY([1, 2]);
	const cell3 = grid.getCellAtXY([1, 4]);

	expect(grid.areNeighbors(cell1, cell2)).toBe(true);
	expect(grid.areNeighbors(cell1, cell3)).toBe(false);
	expect(grid.areNeighbors(cell2, cell3)).toBe(false);
	expect(
		grid.areNeighbors(grid.getCellAtXY([0, 0]), grid.getCellAtXY([0, 1]))
	).toBe(true);
});

test('should determine is a cell is in the grid', () => {
	const grid = new Grid(5, 5);

	expect(grid.isInGrid([0, 0])).toBe(true);
	expect(grid.isInGrid([1, 1])).toBe(true);
	expect(grid.isInGrid([-1, 1])).toBe(false);
	expect(grid.isInGrid([1, -1])).toBe(false);
	expect(grid.isInGrid([5, 5])).toBe(false);
	expect(grid.isInGrid([5, 5])).toBe(false);
});

test('should get cell at specific coordinate', () => {
	const grid = new Grid(5, 5);

	expect(grid.getCellAtXY).toBeDefined();
	expect(grid.getCellAtXY([1, 2])).toEqual(grid.cells[2][1]);
	expect(() => grid.getCellAtXY([-1, 2])).toThrow(Error);
});

test('should resolve cell when given coordinate or cell', () => {
	const grid = new Grid(5, 5);

	expect(grid._resolveCell([1, 2])).toBeInstanceOf(Cell);
	expect(grid._resolveCell([1, 2]).x).toEqual(1);
	expect(grid._resolveCell([1, 2]).y).toEqual(2);
	expect(grid._resolveCell([1, 2])).toEqual(grid.cells[2][1]);
	expect(() => grid._resolveCell([-1, 2]).y).toThrow(Error);
});

test('should get random cell', () => {
	const grid = new Grid(5, 5);

	expect(() =>
		grid.isInGrid(grid.getRandomCell(cell => !cell.isAPath()))
	).toThrow(Error);

	grid.getCellAtXY([1, 2]).setIsObstacle(true);
	grid.getCellAtXY([2, 2]).setIsObstacle(true);

	for (let i = 0; i < 100; i++) {
		expect(grid.isInGrid(grid.getRandomCell())).toBe(true);
		expect(grid.isInGrid(grid.getRandomCell(cell => cell.isAPath()))).toBe(
			true
		);
		expect(grid.isInGrid(grid.getRandomCell(cell => !cell.isAPath()))).toBe(
			true
		);
	}
});
