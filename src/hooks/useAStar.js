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
	const [isProcessing, setIsProcessing] = React.useState(false);

	const [path, setPath] = React.useState(initialPath ?? []);

	const [aStar, setAStar] = React.useState(
		new AStar(initialGrid ?? defaultGrid(), {
			tracePathProgressCb: async (path, _aStar) => {
				setPath(path);
				setAStar(_aStar);

				await sleep(renderSpeed);
			},
		})
	);

	const [startCell, setStartCell] = React.useState(initialStartCell);
	const [endCell, setEndCell] = React.useState(initialEndCell);

	const generateRandomProblem = async () => {
		if (isProcessing) {
			return;
		}

		setIsProcessing(true);

		try {
			const { aStar, newStartCell, newEndCell } = resetAStar({
				randomizeObstacles: true,
			});

			const path = await aStar.findPath(newStartCell, newEndCell);

			if (!path || path.length === 0) {
				alert('no path found');
			}

			setPath(path || []);
		} catch (err) {
			console.log(err);
			setPath([]);
			alert('error');
		}

		setIsProcessing(false);
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

	return {
		isProcessing,
		startCell,
		setStartCell,
		endCell,
		setEndCell,
		aStar,
		setAStar,
		path,
		setPath,
		generateRandomProblem,
	};
};

export default useAStar;
