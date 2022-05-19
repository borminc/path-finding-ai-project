import Grid from './lib/grid.mjs';
import AStar from './lib/aStar.mjs';

export const DEFAULT_CELL_SIZE = 15;

export const DEFAULT_A_STAR_SETTINGS = {
	renderSpeed: 0.1,
	numberOfObstacles: 10,

	gridWidth: 25,
	gridHeight: 25,
	allowDiagonalNeighbors: true,
};

export const mapSettingsToAStar = settings => {
	const newGrid = new Grid(settings.gridWidth, settings.gridHeight, {
		allowDiagonalNeighbors: settings.allowDiagonalNeighbors,
	});

	return new AStar(newGrid);
};
