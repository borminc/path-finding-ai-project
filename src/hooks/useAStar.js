/* eslint-disable no-unused-vars */
import React from 'react';
import Grid from '../lib/grid.mjs';
import AStar from '../lib/aStar.mjs';

const sleep = ms => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

const defaultGrid = () => new Grid(50, 50);

const useAStar = ({
	renderSpeed = 50,
	numberOfObstacles = 100,
	initialStartCell = null,
	initialEndCell = null,
	initialPath = null,
	initialGrid = null,
} = {}) => {
	const [isInProgress, setIsInProgress] = React.useState(false);

	const [path, setPath] = React.useState(initialPath ?? []);
	const [pathStates, setPathStates] = React.useState([]);
	const [gridStates, setGridStates] = React.useState([]);
	const [livePath, setLivePath] = React.useState([]);

	const [aStar, setAStar] = React.useState(
		new AStar(initialGrid ?? defaultGrid(), {
			tracePathProgressCb: (path, grid) => {
				setPathStates(prev => [...prev, path]);
				setGridStates(prev => [...prev, grid]);
			},
		})
	);

	const [liveGrid, setLiveGrid] = React.useState(aStar.grid);

	const [startCell, setStartCell] = React.useState(initialStartCell);
	const [endCell, setEndCell] = React.useState(initialEndCell);

	const findPath = (startCell, endCell, aStar) => {
		if (numberOfObstacles >= aStar.grid.width * aStar.grid.height - 2) {
			alert(
				'number of obstacles exceeds the number of available cells (minus start and end cells)'
			);
			return;
		}
		try {
			// make some cells obstacles
			for (let i = 0; i < numberOfObstacles; i++) {
				aStar.grid
					.getRandomCell(
						cell =>
							cell.isAPath() &&
							!cell.isSameXY(startCell) &&
							!cell.isSameXY(endCell)
					)
					.setIsObstacle(true).data = '  •  ';
			}

			return aStar.findPath(startCell, endCell);
		} catch (err) {
			return [];
		}
	};

	const generateRandomProblem = () => {
		const newStartCell = aStar.grid.getRandomCell(cell => cell.isAPath());
		const newEndCell = aStar.grid.getRandomCell(
			cell => cell.isAPath() && !cell.isSameXY(newStartCell)
		);

		setStartCell(newStartCell);
		setEndCell(newEndCell);

		aStar.grid = initialGrid;
		setAStar(aStar);

		const path = findPath(newStartCell, newEndCell, aStar);
		if (!path || path.length === 0) {
			alert('no path found');
		}
		setPath(path || []);
	};

	const updateLivePath = async () => {
		for (const _path of pathStates) {
			setLivePath(_path);
			await sleep(renderSpeed);
		}

		setLivePath(path); // the final path
		setPathStates([]);

		setIsInProgress(false);
	};

	const updateLiveGrid = async () => {
		for (const _grid of gridStates) {
			setLiveGrid(_grid);
			await sleep(renderSpeed);
		}

		setLiveGrid(aStar.grid); // the final grid
		setGridStates([]);

		setIsInProgress(false);
	};

	// update livePath with path has changed
	React.useEffect(() => {
		setIsInProgress(true);
		updateLiveGrid();
		updateLivePath();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [path]);

	return {
		isInProgress,
		liveGrid,
		startCell,
		setStartCell,
		endCell,
		setEndCell,
		aStar,
		setAStar,
		path,
		pathStates,
		livePath,
		setPath,
		findPath,
		generateRandomProblem,
	};
};

export default useAStar;
