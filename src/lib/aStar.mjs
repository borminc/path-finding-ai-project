import Grid from './grid.mjs';
import { colorString, highlightCell } from './utils/helpers.mjs';
import { euclideanDistance, manhattanDistance } from './utils/heuristic.mjs';

export default class AStar {
	constructor(
		grid,
		{
			useEuclideanDistanceForHeuristic = true,
			includesStartCellInPath = true,
			tracePathProgressCb = null,
		} = {}
	) {
		if (!(grid instanceof Grid)) {
			throw new Error('Grid must be an instance of class Grid');
		}

		this.grid = grid;

		this.useEuclideanDistanceForHeuristic = useEuclideanDistanceForHeuristic;
		this.includesStartCellInPath = includesStartCellInPath;
		this.tracePathProgressCb = tracePathProgressCb;
	}

	heuristic(cell1, cell2) {
		if (this.useEuclideanDistanceForHeuristic)
			return euclideanDistance(cell1, cell2);
		return manhattanDistance(cell1, cell2);
	}

	tracePath(endCell, startCell = null) {
		var path = [];
		var currentCell = endCell;

		while (currentCell.prev) {
			path.push(currentCell);
			currentCell = currentCell.prev;
		}

		return startCell ? [startCell, ...path.reverse()] : path.reverse();
	}

	async findPath(startCell, endCell) {
		startCell = this.grid._resolveCell(startCell);
		endCell = this.grid._resolveCell(endCell);

		var openCellList = [];
		const closedCellList = [];

		openCellList.push(startCell);

		while (openCellList.length > 0) {
			// get the cell with lowest f(x) to process next
			var currentCell = openCellList.reduce((prev, curr) =>
				curr.f < prev.f ? curr : prev
			);

			// end case -- result has been found, return the traced path
			if (currentCell.isSameXY(endCell)) {
				return this.tracePath(
					currentCell,
					this.includesStartCellInPath ? startCell : null
				);
			}

			// normal case -- move currentCell from open to closed, process each of its neighbors
			// eslint-disable-next-line no-loop-func
			openCellList = openCellList.filter(cell => !cell.isSameXY(currentCell));
			closedCellList.push(currentCell);

			const neighbors = this.grid.getNeighborCells(currentCell);

			for (const neighbor of neighbors) {
				if (neighbor.isInCellList(closedCellList) || !neighbor.isAPath()) {
					// not a valid cell to process, skip to next neighbor
					continue;
				}

				// g score is the shortest distance from start to current cell, we need to check if
				// the path we have arrived at this neighbor is the shortest one we have seen yet
				const gScore = currentCell.g + 1; // 1 is the distance from a cell to it's neighbor
				var gScoreIsBest = false;

				if (!neighbor.isInCellList(openCellList)) {
					// This the the first time we have arrived at this cell, it must be the best
					// Also, we need to take the h (heuristic) score since we haven't done so yet

					gScoreIsBest = true;
					neighbor.h = this.heuristic(neighbor, endCell);
					openCellList.push(neighbor);
				} else if (gScore < neighbor.g) {
					// We have already seen the cell, but last time it had a worse g (distance from start)
					gScoreIsBest = true;
				}

				if (gScoreIsBest) {
					// Found an optimal path to this cell (so far).
					// Store the prev cell that led to it and the scores
					neighbor.prev = currentCell;
					neighbor.g = gScore;
					neighbor.f = neighbor.g + neighbor.h;
					neighbor.isVisited = true;

					if (this.tracePathProgressCb) {
						const path = this.tracePath(
							neighbor,
							this.includesStartCellInPath ? startCell : null
						);

						await this.tracePathProgressCb(path, this);
					}
				}
			}
		}

		// No path was found
		return [];
	}

	findPathAndDisplay(startCell, endCell, { separator = '\t' } = {}) {
		console.time('Time');
		console.log(
			`\n${highlightCell(startCell, startCell, endCell)}`,
			`->`,
			`${highlightCell(endCell, startCell, endCell)}\n`
		);

		const path = this.findPath(...arguments);

		if (this.tracePathProgressCb) console.log();

		this.grid.cells.forEach(row => {
			const s = row
				.map(cell => highlightCell(cell, startCell, endCell, path))
				.join(separator);
			console.log(s);
		});

		console.log();

		if (path.length > 0) {
			console.log(
				'Path: ',
				path
					.map(cell => highlightCell(cell, startCell, endCell, path))
					.join(' ')
			);
			console.log(`Cells in path: ${path.length}`);
		} else {
			console.log(colorString('Could not find a path', 'red'));
		}

		console.timeEnd('Time');

		return path;
	}
}
