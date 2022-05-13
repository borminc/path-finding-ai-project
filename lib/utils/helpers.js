const clc = require('cli-color');

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function highlightCell(cell, startCell, endCell, path = []) {
	const s = cell.data;
	if (cell.isEqualTo(startCell)) return clc.cyan(s);
	if (cell.isEqualTo(endCell)) return clc.green(s);
	if (cell.isInCellList(path)) return clc.yellow(s);
	if (cell.isVisited) return clc.magentaBright(s);
	return s;
}

function areEqualDeep(a, b) {
	if (a === b) return true;
	if (a instanceof Date && b instanceof Date)
		return a.getTime() === b.getTime();
	if (!a || !b || (typeof a !== 'object' && typeof b !== 'object'))
		return a === b;
	if (a.prototype !== b.prototype) return false;
	const keys = Object.keys(a);
	if (keys.length !== Object.keys(b).length) return false;
	return keys.every(k => areEqualDeep(a[k], b[k]));
}

module.exports = { getRandomInt, highlightCell, areEqualDeep };
