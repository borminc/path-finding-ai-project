import Grid from './lib/grid.mjs';
import React from 'react';
import useAStar from './hooks/useAStar.js';
import AStar from './lib/aStar.mjs';
import AStarSettingsModal from './aStarSettingsModal.jsx';
import { cloneDeep } from 'lodash';

const CELL_SIZE = 15;

const GridComponent = () => {
	const [settings, setSettings] = React.useState({
		renderSpeed: 0.1,
		numberOfObstacles: 10,
		cellSize: CELL_SIZE,

		gridWidth: 25,
		gridHeight: 25,
		allowDiagonalNeighbors: true,
	});

	const mapSettingsToAStar = settings => {
		const newGrid = new Grid(settings.gridWidth, settings.gridHeight, {
			allowDiagonalNeighbors: settings.allowDiagonalNeighbors,
		});

		return new AStar(newGrid);
	};

	const [aStar, setAStar] = React.useState(mapSettingsToAStar(settings));

	const {
		isProcessing,
		path,
		startCell,
		endCell,
		setStartCell,
		setEndCell,
		cleanGrid,
		startPathFinding,
	} = useAStar(aStar, setAStar, settings);

	const [isMakingObstacles, setIsMakingObstacles] = React.useState(false);

	React.useEffect(() => {
		cleanGrid();
		setAStar(mapSettingsToAStar(settings));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settings]);

	const getCellColor = cell => {
		if (!cell) return 'black';
		if (cell.isObstacle) return 'black';
		if (startCell && cell.isSameXY(startCell)) return 'blue';
		if (endCell && cell.isSameXY(endCell)) return 'green';
		if (cell.isInCellList(path)) return 'yellow';
		if (cell.isVisited) return 'lightgrey';
		return 'white';
	};

	const makeCellAnObstacle = cell => {
		if (startCell && cell.isSameXY(startCell)) return;
		if (endCell && cell.isSameXY(endCell)) return;

		if (cell.isObstacle) cell.setIsObstacle(false);
		else cell.setIsObstacle(true);

		setAStar(cloneDeep(aStar)); // TODO: fnd a less computationally expensive way to update the state
	};

	const cellClickHandler = cell => {
		if (isProcessing) return;
		if (isMakingObstacles) return makeCellAnObstacle(cell);
		if (cell.isObstacle) return;

		cleanGrid({
			withEndCell: false,
			withStartCell: false,
			withObstacles: false,
		});

		if (!startCell && !endCell) setStartCell(cell);
		else if (startCell && !endCell) setEndCell(cell);
		else if ((!startCell && endCell) || (startCell && endCell)) {
			setStartCell(cell);
			setEndCell(null);
		}
	};

	return (
		<div style={{ height: '100%', width: '100%' }}>
			<div>
				Finding path from{' '}
				<span style={{ color: getCellColor(startCell) }}>
					{startCell?.getXYString() || '-'}
				</span>{' '}
				to{' '}
				<span style={{ color: getCellColor(endCell) }}>
					{endCell?.getXYString() || '-'}
				</span>
			</div>

			<div className='d-flex justify-content-between my-2'>
				{isMakingObstacles ? (
					<div>
						<button
							onClick={() => setIsMakingObstacles(false)}
							disabled={isProcessing}
							className='btn btn-sm btn-outline-primary me-3'
						>
							Done
						</button>
					</div>
				) : (
					<div>
						<button
							onClick={startPathFinding}
							disabled={isProcessing}
							className='btn btn-sm btn-outline-primary me-3'
						>
							Run
						</button>

						<button
							onClick={cleanGrid}
							disabled={isProcessing}
							className='btn btn-sm btn-outline-primary me-3'
						>
							Clear
						</button>

						<button
							onClick={() => setIsMakingObstacles(true)}
							disabled={isProcessing}
							className='btn btn-sm btn-outline-primary me-3'
						>
							Make obstacles
						</button>

						<AStarSettingsModal
							aStar={aStar}
							setAStar={setAStar}
							settings={settings}
							setSettings={setSettings}
						/>
					</div>
				)}

				{/* zoom buttons */}
				<div>
					<div className='btn-group'>
						<button
							type='button'
							className='btn btn-sm btn-outline-secondary'
							onClick={() =>
								setSettings({
									...settings,
									cellSize: settings.cellSize - 1,
								})
							}
						>
							-
						</button>
						<button
							type='button'
							className='btn btn-sm btn-outline-secondary'
							onClick={() =>
								setSettings({
									...settings,
									cellSize: settings.cellSize + 1,
								})
							}
						>
							+
						</button>
					</div>
				</div>
			</div>

			<div
				className='d-flex border'
				style={{
					overflow: 'scroll',
					width: '100%',
					height: '80%',
				}}
			>
				<table style={{ width: 'min-content', height: 'min-content' }}>
					<tbody>
						{aStar.grid.cells.map((row, i) => (
							<tr key={i} className=''>
								{row.map(cell => (
									<td
										key={`${cell.x}${cell.y}`}
										style={{
											width: settings.cellSize,
											height: settings.cellSize,
											fontSize: '20%',
											backgroundColor: getCellColor(cell),
										}}
										onClick={() => cellClickHandler(cell)}
									>
										{/* <div>{cell.getXYString()}</div> */}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{path && path.length > 0 && (
				<small className='text-muted'>
					Path: {path.map(cell => cell.getXYString()).join(', ')}
				</small>
			)}
		</div>
	);
};

export default GridComponent;
