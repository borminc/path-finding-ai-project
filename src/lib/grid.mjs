import Cell from './cell.mjs';
import { getRandomInt } from './utils/helpers.mjs';

class Direction {
	static TOP_LEFT = [-1, -1];
	static TOP = [0, -1];
	static TOP_RIGHT = [1, -1];
	static RIGHT = [1, 0];
	static BOTTOM_RIGHT = [1, 1];
	static BOTTOM = [0, 1];
	static BOTTOM_LEFT = [-1, 1];
	static LEFT = [-1, 0];
}

export default class Grid {
	constructor(width, height, { allowDiagonalNeighbors = true } = {}) {
		this.width = width;
		this.height = height;
		this.cells = Array(height).fill(Array(width).fill(null));

		for (let y = 0; y < this.cells.length; y++) {
			const row = [];
			for (let x = 0; x < this.cells[y].length; x++) {
				row.push(new Cell([x, y]));
			}
			this.cells[y] = [...row];
		}

		this.allowDiagonalNeighbors = allowDiagonalNeighbors;
	}

	getAllowedDirections() {
		return this.allowDiagonalNeighbors
			? [
					Direction.TOP_LEFT,
					Direction.TOP,
					Direction.TOP_RIGHT,
					Direction.RIGHT,
					Direction.BOTTOM_RIGHT,
					Direction.BOTTOM,
					Direction.BOTTOM_LEFT,
					Direction.LEFT,
			  ]
			: [Direction.TOP, Direction.RIGHT, Direction.BOTTOM, Direction.LEFT];
	}

	display(mapDataFn = cell => cell) {
		for (const row of this.cells) {
			const s = row.map(mapDataFn).join(' ');
			console.log(s);
		}
	}

	getNeighborCells(cellOrXY) {
		const cell = this._resolveCell(cellOrXY);

		const neighbors = [];

		for (const [dirX, dirY] of this.getAllowedDirections()) {
			const XY = [cell.x + dirX, cell.y + dirY];
			try {
				neighbors.push(this.getCellAtXY(XY));
			} catch (err) {
				// not in grid -> do nothing
			}
		}

		return neighbors;
	}

	areNeighbors(cellOrXY_1, cellOrXY_2) {
		const cell1 = this._resolveCell(cellOrXY_1);
		const cell2 = this._resolveCell(cellOrXY_2);

		return this.getNeighborCells(cell1).some(cell => cell.isSameXY(cell2));
	}

	isInGrid(cellOrXY) {
		try {
			const cell = this._resolveCell(cellOrXY);
			return (
				cell &&
				cell.x >= 0 &&
				cell.x < this.width &&
				cell.y >= 0 &&
				cell.y < this.height
			);
		} catch (error) {
			return false;
		}
	}

	getCellAtXY([x, y]) {
		try {
			const cell = this.cells[y][x];

			if (!cell || !(cell instanceof Cell) || !this.isInGrid(cell))
				throw new Error(`Could not get cell at: (${x},${y})`);

			return cell;
		} catch (e) {
			throw new Error(`Could not get cell at: (${x},${y})`);
		}
	}

	_resolveCell(cellOrXY) {
		if (cellOrXY instanceof Cell) {
			return cellOrXY;
		} else if (cellOrXY instanceof Array && cellOrXY.length === 2) {
			return this.getCellAtXY(cellOrXY);
		}

		throw new Error(
			`Cell must be an instance of Cell or a 2-element array of numbers. Got: ${cellOrXY}`
		);
	}

	getRandomCell(where = cell => true) {
		let cellList = this.cells.flat().filter(where);

		if (cellList.length === 0) {
			throw new Error(
				'Could not get random cell that matches the given condition'
			);
		}

		return cellList[getRandomInt(0, cellList.length - 1)];
	}

	cleanCells({ withObstacles = true } = {}) {
		for (const row of this.cells) {
			for (const cell of row) {
				cell.clean(null, {
					isObstacle: withObstacles ? false : cell.isObstacle,
				});
			}
		}
	}
}
