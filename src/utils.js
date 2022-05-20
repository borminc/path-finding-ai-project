import Grid from './lib/grid.mjs';
import AStar from './lib/aStar.mjs';

export const DEFAULT_A_STAR_SETTINGS = {
	renderSpeed: 0.1,
	numberOfObstacles: 10,

	gridWidth: 25,
	gridHeight: 25,
	allowDiagonalNeighbors: true,
};

export const DEFAULT_GENERAL_SETTINGS = {
	cellSize: 15,
	showConsole: false,

	continuousPlayMode: true,

	colors: {
		cellBorder: 'darkgrey',
		gridBorder: 'black',
		defaultCell: 'white',
		obstacleCell: 'black',
		visitedCell: 'lightgrey',
		pathCell: 'yellow',
		startCell: 'blue',
		endCell: 'green',
	},
};

export const mapSettingsToAStar = settings => {
	const newGrid = new Grid(settings.gridWidth, settings.gridHeight, {
		allowDiagonalNeighbors: settings.allowDiagonalNeighbors,
	});

	return new AStar(newGrid);
};

export function getAStarSettings() {
	const settings = localStorage.getItem('a-star-settings');

	if (settings) return { ...DEFAULT_A_STAR_SETTINGS, ...JSON.parse(settings) };
	return DEFAULT_A_STAR_SETTINGS;
}

export function getGeneralSettings() {
	const settings = localStorage.getItem('general-settings');

	if (settings) return { ...DEFAULT_GENERAL_SETTINGS, ...JSON.parse(settings) };
	return DEFAULT_GENERAL_SETTINGS;
}
