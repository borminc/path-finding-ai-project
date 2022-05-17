import React from 'react';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const useAStar = (
	aStar,
	setAStar,
	{
		renderSpeed = 50,
		numberOfObstacles = 100,
		initialStartCell = null,
		initialEndCell = null,
		initialPath = null,
		defaultAStar = null,
	} = {}
) => {
	const [isProcessing, setIsProcessing] = React.useState(false);

	const [path, setPath] = React.useState(initialPath ?? []);

	const [startCell, setStartCell] = React.useState(initialStartCell);
	const [endCell, setEndCell] = React.useState(initialEndCell);

	React.useEffect(() => {
		aStar.tracePathProgressCb = async (path, _aStar) => {
			setPath(path);
			setAStar(_aStar);

			await sleep(renderSpeed);
		};
	}, [aStar, renderSpeed, setAStar]);

	const startPathFinding = async () => {
		if (isProcessing) {
			return;
		}

		setIsProcessing(true);

		try {
			const { aStar, newStartCell, newEndCell } = resetAStar({
				startCell,
				endCell,
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

	const resetAStar = ({ startCell = null, endCell = null } = {}) => {
		const randomizeObstacles = !(startCell && endCell);

		cleanGrid({ withObstacles: randomizeObstacles });

		const newStartCell =
			startCell ?? aStar.grid.getRandomCell(cell => cell.isAPath());
		const newEndCell =
			endCell ??
			aStar.grid.getRandomCell(
				cell => cell.isAPath() && !cell.isSameXY(newStartCell)
			);

		setStartCell(newStartCell);
		setEndCell(newEndCell);

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

	const cleanGrid = ({
		withStartCell = true,
		withEndCell = true,
		withObstacles = true,
	} = {}) => {
		aStar.grid.cleanCells({ withObstacles });
		setAStar(aStar);
		setPath([]);

		if (withStartCell) setStartCell(null);
		if (withEndCell) setEndCell(null);
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
		cleanGrid,
		startPathFinding,
	};
};

export default useAStar;
