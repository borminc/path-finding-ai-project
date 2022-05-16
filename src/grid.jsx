import Grid from './lib/grid.mjs';
import React from 'react';
import useAStar from './hooks/useAStar.js';
import AStar from './lib/aStar.mjs';
import AStarSettingsModal from './aStarSettingsModal.jsx';

const CELL_SIZE = 15;

const GridComponent = () => {
	const [aStar, setAStar] = React.useState(
		new AStar(new Grid(50, 50, { allowDiagonalNeighbors: true }))
	);
	const [settings, setSettings] = React.useState({
		renderSpeed: 0.1,
		numberOfObstacles: 250,
		cellSize: CELL_SIZE,
	});

	const { isProcessing, path, startCell, endCell, generateRandomProblem } =
		useAStar(aStar, setAStar, settings);

	const getCellColor = cell => {
		if (!cell) return 'black';
		if (cell.isObstacle) return 'black';
		if (startCell && cell.isSameXY(startCell)) return 'blue';
		if (endCell && cell.isSameXY(endCell)) return 'green';
		if (cell.isInCellList(path)) return 'yellow';
		if (cell.isVisited) return 'lightgrey';
		return 'white';
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

			<div>
				<button
					onClick={generateRandomProblem}
					disabled={isProcessing}
					className='btn btn-sm btn-outline-primary my-3 me-3'
				>
					Random
				</button>

				<AStarSettingsModal
					aStar={aStar}
					setAStar={setAStar}
					settings={settings}
					setSettings={setSettings}
				/>
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
