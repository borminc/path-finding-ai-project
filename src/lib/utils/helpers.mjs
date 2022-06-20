export function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function highlightCell(cell, startCell, endCell, path = []) {
	const s = cell.data;
	if (cell.isEqualTo(startCell)) return colorString(s, 'cyan');
	if (cell.isEqualTo(endCell)) return colorString(s, 'green');
	if (cell.isInCellList(path)) return colorString(s, 'yellow');
	if (cell.isVisited) return colorString(s, 'gray');
	return s;
}

export function colorString(s, color) {
	const colorMap = {
		cyan: 46,
		blue: 104,
		yellow: 43,
		magenta: 45,
		brightMagenta: 105,
		red: 41,
		green: 42,
		white: 107,
		gray: 100,
	};
	return `\x1b[${colorMap[color] ?? colorMap.white}m${s}\x1b[0m`;
}

export function areEqualDeep(a, b) {
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
