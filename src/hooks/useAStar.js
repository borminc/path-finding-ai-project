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

			if (!path || path.length === 0) alert('No path found');
			else setPath(path);
		} catch (err) {
			console.log(err);
			setPath([]);
			alert('Error');
		}

		setIsProcessing(false);
	};

	const stopFindingPath = () => {
		if (!isProcessing) return;

		aStar.interrupted = true;
	};

	const resetAStar = ({ startCell = null, endCell = null } = {}) => {
		cleanGrid({
			withObstacles: false,
			withEndCell: false,
			withStartCell: false,
		});

		const newStartCell =
			startCell ?? aStar.grid.getRandomCell(cell => cell.isAPath());
		const newEndCell =
			endCell ??
			aStar.grid.getRandomCell(
				cell => cell.isAPath() && !cell.isSameXY(newStartCell)
			);

		setStartCell(newStartCell);
		setEndCell(newEndCell);

		setAStar(aStar);
		return { aStar, newStartCell, newEndCell };
	};

	const generateRandomGrid = () => {
		if (numberOfObstacles > aStar.grid.width * aStar.grid.height - 2) {
			alert(
				'Number of obstacles exceeds the number of available cells (minus start and end cells). Change this in A* settings.'
			);
			return;
		}

		cleanGrid({
			withStartCell: false,
			withEndCell: false,
			withObstacles: true,
		});

		const newStartCell = aStar.grid.getRandomCell(cell => cell.isAPath());
		const newEndCell = aStar.grid.getRandomCell(
			cell => cell.isAPath() && !cell.isSameXY(newStartCell)
		);

		for (let i = 0; i < numberOfObstacles; i++) {
			aStar.grid
				.getRandomCell(cell => {
					return (
						cell.isAPath() &&
						!cell.isSameXY(newStartCell) &&
						!cell.isSameXY(newEndCell)
					);
				})
				.setIsObstacle(true).data = '  •  ';
		}

		setStartCell(newStartCell);
		setEndCell(newEndCell);
		// setAStar(aStar); // somehow this isn't needed anymore ;-;
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
		generateRandomGrid,
		startPathFinding,
		stopFindingPath,
	};
};

export default useAStar;
