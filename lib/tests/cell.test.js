const Cell = require('../cell');

test('should be defined', () => {
	expect(Cell).toBeDefined();
});

test('should have coordinates', () => {
	const cell = new Cell([1, 2]);

	expect(cell.x).toBeDefined();
	expect(cell.y).toBeDefined();
	expect(cell.x).toBe(1);
	expect(cell.y).toBe(2);
});

test('getXY() should return a 2-element array', () => {
	const cell = new Cell([1, 2]);

	expect(cell.getXY).toBeDefined();
	expect(cell.getXY()).toEqual([1, 2]);
});

test('should give string coordinates', () => {
	const cell = new Cell([1, 2]);

	expect(cell.getXYString).toBeDefined();
	expect(cell.getXYString()).toEqual('(1,2)');
});

test('should compare two cells', () => {
	const cell = new Cell([1, 2]);

	expect(cell.isSameXY).toBeDefined();
	expect(cell.isSameXY(new Cell([1, 2]))).toBe(true);
	expect(cell.isSameXY(new Cell([0, 0]))).toBe(false);
});

test('should determine if cell is in list', () => {
	const cell = new Cell([1, 2]);

	const cellList = [
		new Cell([0, 0]),
		new Cell([1, 2]),
		new Cell([3, 4]),
		new Cell([5, 6]),
		new Cell([7, 8]),
	];

	expect(cell.isInCellList).toBeDefined();
	expect(cell.isInCellList(cellList)).toBe(true);
	expect(new Cell([2, 1]).isInCellList(cellList)).toBe(false);
	expect(new Cell([8, 9]).isInCellList(cellList)).toBe(false);
});

test('should be either a path or not a path', () => {
	const cell = new Cell([1, 2]);

	expect(cell.isAPath).toBeDefined();
	expect(cell.isAPath()).toBe(true);

	cell.setIsObstacle(true);
	expect(cell.isAPath()).toBe(false);

	cell.isObstacle = false;
	expect(cell.isAPath()).toBe(true);

	expect(new Cell([1, 2], null, { isObstacle: true }).isAPath()).toBe(false);
	expect(new Cell([1, 2], null, { isObstacle: false }).isAPath()).toBe(true);
});

test('should compare for deep equality', () => {
	const a = new Cell([1, 2]);
	const b = new Cell([1, 2]);

	expect(a).not.toBe(b);
	expect(a).toEqual(b);
	expect(a).not.toEqual(new Cell([0, 1]));

	b.setIsObstacle(true);

	expect(a).not.toEqual(b);
});

test('should make a deep clone', () => {
	const cell = new Cell([1, 2], 'data');

	const clone = cell.clone();

	expect(cell).not.toBe(clone);
	expect(cell).toEqual(clone);

	clone.x = 2;
	expect(cell).not.toEqual(clone);
	expect(cell.x).toBe(1);
});
