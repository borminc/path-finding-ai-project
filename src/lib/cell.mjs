import { areEqualDeep } from './utils/helpers.mjs';
import lodash from 'lodash';

class Cell {
	constructor([x, y], data = null, { isObstacle = false } = {}) {
		this.x = x;
		this.y = y;
		this.data = data ?? `(${x},${y})`;

		this.f = 0;
		this.h = 0;
		this.g = 0;
		this.prev = null;

		this.isObstacle = isObstacle;
		this.isVisited = false;
		this.isClosed = false;
	}

	display(mapDataFn = cell => cell.data) {
		console.log(mapDataFn(this));
	}

	getXY() {
		return [this.x, this.y];
	}

	getXYString() {
		return `(${this.x},${this.y})`;
	}

	isSameXY(cell) {
		return this.x === cell.x && this.y === cell.y;
	}

	isEqualTo(cell) {
		// check for deep equality
		return areEqualDeep(this, cell);
	}

	isInCellList(cells) {
		console.log('isInCellList');
		return cells.some(cell => this.isSameXY(cell));
	}

	isAPath() {
		return !this.isObstacle;
	}

	setIsObstacle(value = true) {
		this.isObstacle = !!value;
		return this;
	}

	clone() {
		return lodash.cloneDeep(this);
	}

	clean(data = null, { isObstacle = false } = {}) {
		this.data = data ?? this.data;

		this.f = 0;
		this.h = 0;
		this.g = 0;
		this.prev = null;

		this.isObstacle = isObstacle;
		this.isVisited = false;
		this.isClosed = false;
	}
}

export default Cell;
