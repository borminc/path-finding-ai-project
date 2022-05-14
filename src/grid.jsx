import Grid from './lib/grid.mjs';
import React from 'react';
import useAStar from './hooks/useAStar.js';

const CELL_SIZE = 15;

const GridComponent = () => {
	const {
		isOutputting,
		liveGrid,
		startCell,
		endCell,
		livePath,
		generateRandomProblem,
	} = useAStar({
		initialGrid: new Grid(50, 50, { allowDiagonalNeighbors: false }),
		renderSpeed: 0.25,
		numberOfObstacles: 250,
	});
	const [cellSize, setCellSize] = React.useState(CELL_SIZE);

	const getCellColor = cell => {
		if (!cell) return 'black';
		if (cell.isObstacle) return 'black';
		if (startCell && cell.isSameXY(startCell)) return 'blue';
		if (endCell && cell.isSameXY(endCell)) return 'green';
		if (cell.isInCellList(livePath)) return 'yellow';
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
					disabled={isOutputting}
					className='btn btn-sm btn-outline-primary my-3 me-3'
				>
					Random
				</button>

				<span>Cell size: {cellSize}</span>
				<div className='btn-group ms-1'>
					<button
						type='button'
						className='btn btn-sm btn-outline-primary'
						onClick={() => setCellSize(prev => prev - 1)}
					>
						-
					</button>
					<button
						type='button'
						className='btn btn-sm btn-outline-primary'
						onClick={() => setCellSize(prev => prev + 1)}
					>
						+
					</button>
				</div>
			</div>

			<div
				className='d-flex'
				style={{
					overflow: 'scroll',
					maxWidth: '100%',
					maxHeight: '90%',
				}}
			>
				<table style={{ width: 'min-content' }}>
					<tbody>
						{liveGrid.cells.map((row, i) => (
							<tr key={i} className=''>
								{row.map(cell => (
									<td
										key={`${cell.x}${cell.y}`}
										style={{
											width: cellSize,
											height: cellSize,
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
		</div>
	);
};

export default GridComponent;
