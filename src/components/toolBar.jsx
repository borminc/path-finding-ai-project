import {
	AStarServiceContext,
	AStarSettingsContext,
	GeneralSettingsContext,
} from '../contexts';
import AStarSettingsModal from './aStarSettingsModal';
import React from 'react';
import GeneralSettingsModal from './generalSettingsModal';

const ToolBar = ({
	isMakingObstacles,
	setIsMakingObstacles,
	testUserPath,
	gameMode,
	setGameMode,
	setUserPath,
	...props
}) => {
	const { isProcessing, generateRandomGrid, startPathFinding, cleanGrid } =
		React.useContext(AStarServiceContext);
	const setGeneralSettings = React.useContext(GeneralSettingsContext)[1];
	const aStarSettings = React.useContext(AStarSettingsContext)[0];

	return (
		<div {...props}>
			<h5>Path-finding AI</h5>

			<div className='d-md-flex justify-content-between my-2'>
				<div className='col-12 col-md-6'>
					{isMakingObstacles ? (
						<div className='float-start my-1'>
							<span className='me-2'>Click on the grid to make obstacles.</span>

							<button
								onClick={() => setIsMakingObstacles(false)}
								disabled={isProcessing}
								className='btn btn-sm btn-outline-primary me-1'
								title='Done'
							>
								<i className='bi bi-check'></i>
							</button>
						</div>
					) : (
						<div className='float-start d-flex my-1'>
							<select
								className='form-select form-select-sm me-3'
								aria-label='.form-select-sm example'
								defaultValue={gameMode}
								onChange={e => setGameMode(e.target.value)}
							>
								<option value='explore'>Explore</option>
								<option value='play'>Play</option>
							</select>

							<button
								onClick={startPathFinding}
								disabled={isProcessing || gameMode === 'play'}
								className='btn btn-sm btn-outline-primary me-1'
								title='Run'
							>
								<i className='bi bi-play-fill'></i>
							</button>

							<button
								onClick={() => {
									let a = window.confirm(
										'Reset grid: Everything will be lost. Are you sure?'
									);
									if (a) cleanGrid();
								}}
								disabled={isProcessing || gameMode === 'play'}
								className='btn btn-sm btn-outline-primary me-3'
								title='Reset'
							>
								<i className='bi bi-arrow-counterclockwise me-1'></i>
							</button>

							<button
								onClick={generateRandomGrid}
								disabled={isProcessing}
								className='btn btn-sm btn-outline-primary me-1'
								title='Randomize grid'
							>
								<i className='bi bi-arrow-repeat'></i>
							</button>

							<button
								onClick={() => setIsMakingObstacles(true)}
								disabled={isProcessing}
								className='btn btn-sm btn-outline-primary me-3'
								title='Edit obstacles'
							>
								<i className='bi bi-pencil'></i>
							</button>

							{gameMode === 'play' && (
								<button
									onClick={() => {
										setUserPath([]);
										cleanGrid({
											withStartCell: false,
											withEndCell: false,
											withObstacles: false,
										});
									}}
									disabled={isProcessing}
									className='btn btn-sm btn-outline-primary me-3'
									title='Clear path and retry'
								>
									Retry
								</button>
							)}
						</div>
					)}
				</div>

				<div className='col-12 col-md-6'>
					<div className='float-end my-1'>
						<AStarSettingsModal />
						<GeneralSettingsModal className='ms-1' />

						<button
							type='button'
							className='btn btn-sm btn-outline-secondary ms-1'
							title='Show console'
							onClick={() =>
								setGeneralSettings(prev => ({
									...prev,
									showConsole: !prev.showConsole,
								}))
							}
						>
							<i className='bi bi-window-desktop'></i>{' '}
						</button>

						<div className='btn-group ms-3'>
							<button
								type='button'
								className='btn btn-sm btn-outline-secondary'
								title='Zoom out'
								onClick={() =>
									setGeneralSettings(prev => ({
										...prev,
										cellSize: prev.cellSize - 1,
									}))
								}
							>
								<i className='bi bi-zoom-out'></i>
							</button>
							<button
								type='button'
								className='btn btn-sm btn-outline-secondary'
								title='Fit width'
								onClick={() => {
									const gridContainer =
										document.getElementById('grid-container');
									const width = gridContainer?.clientWidth || window.innerWidth;
									const cellSize = Math.round(width / aStarSettings.gridWidth);
									setGeneralSettings(prev => ({
										...prev,
										cellSize: cellSize,
									}));
								}}
							>
								<i className='bi bi-distribute-vertical'></i>
							</button>
							<button
								type='button'
								className='btn btn-sm btn-outline-secondary'
								title='Fit height'
								onClick={() => {
									const gridContainer =
										document.getElementById('grid-container');
									const height =
										gridContainer?.clientHeight || window.innerHeight;
									const cellSize = Math.round(
										height / aStarSettings.gridHeight
									);
									setGeneralSettings(prev => ({
										...prev,
										cellSize: cellSize,
									}));
								}}
							>
								<i className='bi bi-distribute-horizontal'></i>
							</button>
							<button
								type='button'
								className='btn btn-sm btn-outline-secondary'
								title='Zoom in'
								onClick={() =>
									setGeneralSettings(prev => ({
										...prev,
										cellSize: prev.cellSize + 1,
									}))
								}
							>
								<i className='bi bi-zoom-in'></i>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ToolBar;
