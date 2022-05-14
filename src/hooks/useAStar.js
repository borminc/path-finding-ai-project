import React from 'react';
import Grid from '../lib/grid.mjs';
import AStar from '../lib/aStar.mjs';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const defaultGrid = () => new Grid(50, 50);

const useAStar = ({
	renderSpeed = 50,
	numberOfObstacles = 100,
	initialStartCell = null,
	initialEndCell = null,
	initialPath = null,
	initialGrid = null,
} = {}) => {
	const [isOutputting, setIsOutputting] = React.useState(false);

	const [path, setPath] = React.useState(initialPath ?? []);
	const [livePath, setLivePath] = React.useState([]);

	const [pathStates, setPathStates] = React.useState([]);
	const [gridStates, setGridStates] = React.useState([]);

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

	const generateRandomProblem = () => {
		try {
			const { aStar, newStartCell, newEndCell } = resetAStar({
				randomizeObstacles: true,
			});

			const path = aStar.findPath(newStartCell, newEndCell);

			if (!path || path.length === 0) {
				alert('no path found');
			}

			setPath(path || []);
		} catch (err) {
			console.log(err);
			setPath([]);
			alert('error');
		}
	};

	const resetAStar = ({
		startCell = null,
		endCell = null,
		randomizeObstacles = false,
	} = {}) => {
		const newStartCell =
			startCell ?? aStar.grid.getRandomCell(cell => cell.isAPath());
		const newEndCell =
			endCell ??
			aStar.grid.getRandomCell(
				cell => cell.isAPath() && !cell.isSameXY(newStartCell)
			);

		setStartCell(newStartCell);
		setEndCell(newEndCell);

		aStar.grid = initialGrid;

		if (!randomizeObstacles) {
			setAStar(aStar);
			return { aStar, newStartCell, newEndCell };
		}

		if (numberOfObstacles >= aStar.grid.width * aStar.grid.height - 2) {
			alert(
				'number of obstacles exceeds the number of available cells (minus start and end cells)'
			);
		} else {
			for (let i = 0; i < numberOfObstacles; i++) {
				aStar.grid
					.getRandomCell(
						cell =>
							cell.isAPath() &&
							!cell.isSameXY(newStartCell) &&
							!cell.isSameXY(newEndCell)
					)
					.setIsObstacle(true).data = '  •  ';
			}
		}

		setAStar(aStar);
		return { aStar, newStartCell, newEndCell };
	};

	const updateLivePath = async path => {
		if (!path || path.length === 0) {
			setIsOutputting(false);
			return;
		}

		for (const _path of pathStates) {
			setLivePath(_path);
			await sleep(renderSpeed);
		}

		setLivePath(path); // the final path
		setPathStates([]);

		setIsOutputting(false);
	};

	const updateLiveGrid = async path => {
		if (!path || path.length === 0) {
			setIsOutputting(false);
			return;
		}

		for (const _grid of gridStates) {
			setLiveGrid(_grid);
			await sleep(renderSpeed);
		}

		setLiveGrid(aStar.grid); // the final grid
		setGridStates([]);

		setIsOutputting(false);
	};

	// update livePath when path has changed
	React.useEffect(() => {
		setIsOutputting(true);
		updateLiveGrid(path);
		updateLivePath(path);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [path]);

	return {
		isOutputting,
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
		generateRandomProblem,
	};
};

export default useAStar;
