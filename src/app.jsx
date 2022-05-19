import React from 'react';
import useAStar from './hooks/useAStar.js';
import { cloneDeep } from 'lodash';
import ToolBar from './components/toolBar';
import { AStarServiceContext, SettingsContext } from './contexts';
import {
	DEFAULT_A_STAR_SETTINGS,
	DEFAULT_CELL_SIZE,
	mapSettingsToAStar,
} from './utils';

const App = () => {
	const [settings, setSettings] = React.useState(DEFAULT_A_STAR_SETTINGS);
	const [aStar, setAStar] = React.useState(mapSettingsToAStar(settings));
	const [isMakingObstacles, setIsMakingObstacles] = React.useState(false);
	const [isMouseDown, setIsMouseDown] = React.useState(false);
	const [cellSize, setCellSize] = React.useState(DEFAULT_CELL_SIZE);

	const aStarService = useAStar(aStar, setAStar, settings);

	const {
		isProcessing,
		path,
		startCell,
		endCell,
		setStartCell,
		setEndCell,
		cleanGrid,
	} = aStarService;

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
		if (isProcessing) return;
		if (startCell && cell.isSameXY(startCell)) return;
		if (endCell && cell.isSameXY(endCell)) return;

		if (cell.isObstacle) cell.setIsObstacle(false);
		else cell.setIsObstacle(true);

		setAStar(cloneDeep(aStar)); // TODO: fnd a less computationally expensive way to update the state
	};

	const cellMouseDownHandler = cell => {
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

	const cellMouseOverHandler = cell => {
		if (!isMouseDown) return;
		cellMouseDownHandler(cell);
	};

	React.useEffect(() => {
		cleanGrid();
		setAStar(mapSettingsToAStar(settings));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [settings]);

	return (
		<SettingsContext.Provider value={[settings, setSettings]}>
			<AStarServiceContext.Provider value={aStarService}>
				<div className='vh-100 vw-100 p-2'>
					<ToolBar
						isMakingObstacles={isMakingObstacles}
						setIsMakingObstacles={setIsMakingObstacles}
						setCellSize={setCellSize}
					/>

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
													width: cellSize,
													height: cellSize,
													fontSize: '20%',
													backgroundColor: getCellColor(cell),
												}}
												onMouseOver={() => cellMouseOverHandler(cell)}
												onMouseUp={() => setIsMouseDown(false)}
												onMouseDown={() => {
													cellMouseDownHandler(cell);
													setIsMouseDown(true);
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
			</AStarServiceContext.Provider>
		</SettingsContext.Provider>
	);
};

export default App;
