import Grid from './grid.mjs';
import { colorString, highlightCell } from './utils/helpers.mjs';
import { euclideanDistance, manhattanDistance } from './utils/heuristic.mjs';
import { Heap } from 'heap-js';

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

		this.interrupted = false;
	}

	heuristic(cell1, cell2) {
		if (this.useEuclideanDistanceForHeuristic)
			return euclideanDistance(cell1, cell2);
		return manhattanDistance(cell1, cell2);
	}

	initHeap() {
		return new Heap((cell1, cell2) => cell1.f - cell2.f);
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

	async findPath(startCell, endCell, { useCallback = true } = {}) {
		startCell = this.grid._resolveCell(startCell);
		endCell = this.grid._resolveCell(endCell);

		const openCellsHeap = this.initHeap();

		openCellsHeap.push(startCell);

		while (!openCellsHeap.isEmpty()) {
			const currentCell = openCellsHeap.pop(); // cell with lowest f
			currentCell.isClosed = true; // mark as close because we will be done with this cell after this loop

			if (currentCell.isSameXY(endCell)) {
				// found
				return this.tracePath(
					currentCell,
					this.includesStartCellInPath ? startCell : null
				);
			}

			const neighbors = this.grid.getNeighborCells(currentCell);

			for (const neighbor of neighbors) {
				if (neighbor.isClosed || !neighbor.isAPath()) continue;

				const gScore = currentCell.g + 1; // assume cost between 2 cells is 1

				if (!neighbor.isVisited || gScore < neighbor.g) {
					// first time seeing this cell, or
					// saw it before but we have a lower g this time
					neighbor.prev = currentCell;

					neighbor.h = this.heuristic(neighbor, endCell);
					neighbor.g = gScore;
					neighbor.f = neighbor.g + neighbor.h;

					if (!neighbor.isVisited) {
						// first time
						neighbor.isVisited = true;
						openCellsHeap.push(neighbor);
					} else {
						// scores have changed -> rearrange heap
						openCellsHeap.remove(neighbor, (c1, c2) => c1.isSameXY(c2));
						openCellsHeap.push(neighbor);
					}

					if (this.interrupted) {
						// user interrupted/stopped the process
						this.interrupted = false;
						return this.tracePath(
							neighbor,
							this.includesStartCellInPath ? startCell : null
						);
					}

					if (useCallback && this.tracePathProgressCb) {
						const path = this.tracePath(
							neighbor,
							this.includesStartCellInPath ? startCell : null
						);

						await this.tracePathProgressCb(path, this);
					}
				}
			}
		}

		// no path found
		return [];
	}

	async findPathAndDisplay(startCell, endCell, { separator = '\t' } = {}) {
		console.time('Time');
		console.log(
			`\n${highlightCell(startCell, startCell, endCell)}`,
			`->`,
			`${highlightCell(endCell, startCell, endCell)}\n`
		);

		const path = await this.findPath(...arguments);

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
