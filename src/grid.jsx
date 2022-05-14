/* eslint-disable no-unused-vars */
import Grid from './lib/grid.mjs';
import AStar from './lib/aStar.mjs';
import React, { useEffect } from 'react';
import useAStar from './hooks/useAStar.js';

const CELL_SIZE = '15px';

const GridComponent = () => {
	const {
		isInProgress,
		liveGrid,
		startCell,
		endCell,
		aStar,
		livePath,
		pathStates,
		generateRandomProblem,
	} = useAStar({
		initialGrid: new Grid(100, 50, { allowDiagonalNeighbors: false }),
		renderSpeed: 1,
		numberOfObstacles: 250,
	});

	const getCellColor = cell => {
		if (!cell) return 'white';
		if (cell.isObstacle) return 'black';
		if (startCell && cell.isSameXY(startCell)) return 'blue';
		if (endCell && cell.isSameXY(endCell)) return 'green';
		if (cell.isInCellList(livePath)) return 'yellow';
		if (cell.isVisited) return 'lightgrey';
		return 'white';
	};

	useEffect(() => {
		// console.log(liveGrid);
	}, [livePath, liveGrid]);

	return (
		<>
			<div>
				Finding path from{' '}
				<span style={{ color: getCellColor(startCell) }}>
					{startCell?.getXYString()}
				</span>{' '}
				to{' '}
				<span style={{ color: getCellColor(endCell) }}>
					{endCell?.getXYString()}
				</span>
				<button onClick={generateRandomProblem} disabled={isInProgress}>
					Random
				</button>
			</div>
			<table>
				<tbody>
					{liveGrid.cells.map((row, i) => (
						<tr key={i} className=''>
							{row.map(cell => (
								<td
									key={`${cell.x}${cell.y}`}
									style={{
										width: CELL_SIZE,
										height: CELL_SIZE,
										fontSize: '20%',
										backgroundColor: getCellColor(cell),
									}}
								>
									<div>{cell.getXYString()}</div>
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
};

export default GridComponent;
