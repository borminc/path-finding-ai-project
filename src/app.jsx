import React from 'react';
import useAStar from './hooks/useAStar.js';
import { cloneDeep } from 'lodash';
import ToolBar from './components/toolBar';
import {
	AStarServiceContext,
	AStarSettingsContext,
	GeneralSettingsContext,
} from './contexts';
import {
	getAStarSettings,
	getGeneralSettings,
	mapSettingsToAStar,
} from './utils';

const App = () => {
	const [generalSettings, setGeneralSettings] =
		React.useState(getGeneralSettings);

	const [aStarSettings, setAStarSettings] = React.useState(getAStarSettings);

	const [aStar, setAStar] = React.useState(mapSettingsToAStar(aStarSettings));
	const aStarService = useAStar(aStar, setAStar, aStarSettings);

	const [isMakingObstacles, setIsMakingObstacles] = React.useState(false);
	const [isMouseDown, setIsMouseDown] = React.useState(false);

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
		const colors = generalSettings.colors;
		if (!cell || cell.isObstacle) return colors.obstacleCell;
		if (startCell && cell.isSameXY(startCell)) return colors.startCell;
		if (endCell && cell.isSameXY(endCell)) return colors.endCell;
		if (cell.isInCellList(path)) return colors.pathCell;
		if (cell.isVisited) return colors.visitedCell;
		return colors.defaultCell;
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

		if (isMouseDown) return;

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
		localStorage.setItem('general-settings', JSON.stringify(generalSettings));
	}, [generalSettings]);

	React.useEffect(() => {
		cleanGrid();
		setAStar(mapSettingsToAStar(aStarSettings));
		localStorage.setItem('a-star-settings', JSON.stringify(aStarSettings));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [aStarSettings]);

	return (
		<GeneralSettingsContext.Provider
			value={[generalSettings, setGeneralSettings]}
		>
			<AStarSettingsContext.Provider value={[aStarSettings, setAStarSettings]}>
				<AStarServiceContext.Provider value={aStarService}>
					<div className='d-flex flex-column w-100 h-100 p-2'>
						<ToolBar
							isMakingObstacles={isMakingObstacles}
							setIsMakingObstacles={setIsMakingObstacles}
						/>

						<div
							className='d-flex flex-grow-1 border w-100 h-100'
							style={{
								overflow: 'scroll',
								justifyContent: 'flex-start',
								alignItems: 'flex-start',
							}}
							onMouseUp={() => setIsMouseDown(false)}
						>
							<table
								style={{
									margin: 'auto',
									width: 'min-content',
									height: 'min-content',
									border: `solid 1.5px ${generalSettings.colors.gridBorder}`,
								}}
							>
								<tbody>
									{aStar.grid.cells.map((row, i) => (
										<tr key={i}>
											{row.map(cell => (
												<td
													key={`${cell.x}${cell.y}`}
													style={{
														width: generalSettings.cellSize,
														height: generalSettings.cellSize,
														fontSize: '20%',
														backgroundColor: getCellColor(cell),
														border: `solid 1px ${generalSettings.colors.cellBorder}`,
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

						{generalSettings.showConsole && (
							<div style={{ height: '50%', overflowY: 'scroll' }}>
								<small>Console</small>
								<div>
									{path && path.length > 0 && (
										<small className='text-muted'>
											Path: {path.map(cell => cell.getXYString()).join(', ')}
										</small>
									)}
								</div>
							</div>
						)}
					</div>
				</AStarServiceContext.Provider>
			</AStarSettingsContext.Provider>
		</GeneralSettingsContext.Provider>
	);
};

export default App;
