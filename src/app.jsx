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
		generateRandomGrid,
	} = aStarService;

	const [gameMode, setGameMode] = React.useState('explore');
	const [userPath, setUserPath] = React.useState([]); // when user plays in play mode

	const isInPlayMode = React.useMemo(() => gameMode === 'play', [gameMode]);

	const getCellColor = cell => {
		const colors = generalSettings.colors;
		if (!cell || cell.isObstacle) return colors.obstacleCell;
		if (startCell && cell.isSameXY(startCell)) return colors.startCell;

		if (endCell && cell.isSameXY(endCell)) return colors.endCell;

		if (!isInPlayMode && cell.isInCellList(path)) return colors.pathCell;
		if (isInPlayMode && cell.isInCellList(userPath)) return colors.pathCell;
		if (cell.isVisited) return colors.visitedCell;
		return colors.defaultCell;
	};

	const getCellOpacity = cell => {
		if (!cell) return 1;
		if (
			isInPlayMode &&
			startCell &&
			endCell &&
			(cell.isSameXY(startCell) || cell.isSameXY(endCell)) &&
			!cell.isInCellList(userPath)
		)
			return 0.25;
		return 1;
	};

	const makeCellAnObstacle = cell => {
		if (isProcessing) return;
		if (startCell && cell.isSameXY(startCell)) return;
		if (endCell && cell.isSameXY(endCell)) return;

		if (cell.isObstacle) cell.setIsObstacle(false);
		else cell.setIsObstacle(true);

		setAStar(cloneDeep(aStar)); // TODO: fnd a less computationally expensive way to update the state
		setUserPath([]);
	};

	const traceUserPath = cell => {
		if (isProcessing) return;
		if (!startCell || !endCell) return;
		if (cell.isObstacle) return;

		if (userPath.length === 0) {
			if (!cell.isSameXY(startCell)) return;
			return setUserPath(prev => [...prev, cell]);
		}

		const lastCell = userPath[userPath.length - 1];

		if (lastCell.isSameXY(cell)) {
			return setUserPath(userPath.filter(c => !c.isSameXY(cell)));
		}

		if (
			!aStar.grid.areNeighbors(cell, lastCell) ||
			userPath.some(c => cell.isSameXY(c))
		)
			return; // don't add if not neighbors with lastCell or cell is already in path

		cell.prev = lastCell;
		cell.g = (lastCell.g || 0) + 1; // don't count the start cell
		cell.h = aStar.heuristic(cell, endCell);
		cell.f = cell.g + cell.h;
		cell.isVisited = true;

		if (cell.isSameXY(endCell)) {
			setTimeout(() => {
				testUserPath([...userPath, cell]);
				setIsMouseDown(false);
			}, 100);
		}

		if (!endCell.isInCellList(userPath)) {
			setUserPath(prev => [...prev, cell]);
		}
	};

	const testUserPath = async (_userPath = null) => {
		_userPath = _userPath || userPath;

		if (!isInPlayMode || !startCell || !endCell || _userPath.length === 0)
			return;

		if (
			!_userPath[0].isSameXY(startCell) ||
			!_userPath[_userPath.length - 1].isSameXY(endCell)
		) {
			return alert(
				'Your path must begin and terminate at the start and end cells.'
			);
		}

		const _aStar = cloneDeep(aStar);
		const path = await _aStar.findPath(startCell, endCell, {
			useCallback: false,
		});

		if (path.length === 0) {
			alert('There is no path!');
		}

		const cost = path[path.length - 1].f;
		const userCost = _userPath[_userPath.length - 1].f;

		if (cost < userCost) {
			setUserPath([]);
			return alert(
				`There is a better way! Your path costs ${userCost}, but there is a path that costs ${cost}.`
			);
		}

		if (cost > userCost) {
			setUserPath([]);
			return alert(
				`You beat the AI! Your path costs ${userCost}, but the AI's path costs ${cost}.`
			);
		}

		if (cost === userCost) {
			if (generalSettings.continuousPlayMode) generateRandomGrid();
			return alert(`You got it! The best path costs ${cost}`);
		}
	};

	const cellMouseDownHandler = cell => {
		if (isProcessing) return;
		if (isMakingObstacles) return makeCellAnObstacle(cell);
		if (cell.isObstacle) return;
		if (isInPlayMode) return traceUserPath(cell);

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

	const renderConsole = () => {
		let _path = path;

		if (isInPlayMode) {
			_path = userPath;
		}

		return (
			<>
				<div>
					{_path && _path.length > 0 && (
						<small>Total cost (f): {_path[_path.length - 1].f}</small>
					)}
				</div>
				<div>
					{_path && _path.length > 0 && (
						<small>
							Path: {_path.map(cell => cell.getXYString()).join(', ')}
						</small>
					)}
				</div>
			</>
		);
	};

	React.useEffect(() => {
		localStorage.setItem('general-settings', JSON.stringify(generalSettings));
	}, [generalSettings]);

	React.useEffect(() => {
		cleanGrid();
		setAStar(mapSettingsToAStar(aStarSettings));
		setUserPath([]);
		localStorage.setItem('a-star-settings', JSON.stringify(aStarSettings));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [aStarSettings]);

	React.useEffect(() => {
		setUserPath([]);
	}, [startCell, endCell]);

	React.useEffect(() => {
		setUserPath([]);
		cleanGrid({
			withEndCell: false,
			withStartCell: false,
			withObstacles: false,
		});

		if (isInPlayMode && !startCell && !endCell) generateRandomGrid(); // give user sth to start playing

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isInPlayMode]);

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
							testUserPath={testUserPath}
							gameMode={gameMode}
							setGameMode={setGameMode}
							setUserPath={setUserPath}
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
														opacity: getCellOpacity(cell),
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
							<div
								className='text-muted'
								style={{ height: '50%', overflowY: 'scroll' }}
							>
								<small>Console</small>
								{renderConsole()}
							</div>
						)}
					</div>
				</AStarServiceContext.Provider>
			</AStarSettingsContext.Provider>
		</GeneralSettingsContext.Provider>
	);
};

export default App;
