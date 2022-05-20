import { AStarServiceContext, GeneralSettingsContext } from '../contexts';
import AStarSettingsModal from './aStarSettingsModal';
import React from 'react';
import { DEFAULT_GENERAL_SETTINGS } from '../utils';
import GeneralSettingsModal from './generalSettingsModal';

const ToolBar = ({
	isMakingObstacles,
	setIsMakingObstacles,
	isUserPlaying,
	setIsUserPlaying,
	testUserPath,
	userCanPlay,
	...props
}) => {
	const { isProcessing, generateRandomGrid, startPathFinding, cleanGrid } =
		React.useContext(AStarServiceContext);
	const setGeneralSettings = React.useContext(GeneralSettingsContext)[1];

	return (
		<div {...props}>
			<h5>Path-finding AI</h5>

			<div className='d-flex justify-content-between my-2'>
				{isMakingObstacles ? (
					<div>
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
					<div>
						<button
							onClick={startPathFinding}
							disabled={isProcessing || isUserPlaying}
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
							disabled={isProcessing || isUserPlaying}
							className='btn btn-sm btn-outline-primary me-1'
							title='Reset'
						>
							<i className='bi bi-arrow-counterclockwise me-1'></i>
						</button>

						<button
							onClick={generateRandomGrid}
							disabled={isProcessing}
							className='btn btn-sm btn-outline-primary ms-2  me-1'
							title='Randomize grid'
						>
							<i className='bi bi-arrow-repeat'></i>
						</button>

						<button
							onClick={() => setIsMakingObstacles(true)}
							disabled={isProcessing}
							className='btn btn-sm btn-outline-primary me-1'
							title='Edit obstacles'
						>
							<i className='bi bi-pencil'></i>
						</button>

						<button
							onClick={() => {
								if (!userCanPlay) {
									return alert('Pick start and end cells first!');
								}
								setIsUserPlaying(!isUserPlaying);
							}}
							disabled={isProcessing || !userCanPlay}
							className='btn btn-sm btn-outline-primary ms-2 me-1'
							title='Play'
						>
							{/* <i className='bi bi-play-fill'></i> */}
							{!isUserPlaying ? 'Play' : 'Done'}
						</button>

						{isUserPlaying && (
							<button
								onClick={() => testUserPath(null)}
								disabled={isProcessing}
								className='btn btn-sm btn-outline-primary me-1'
								title='Test path'
							>
								Test path
							</button>
						)}
					</div>
				)}

				<div>
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
							title='Reset cell size'
							onClick={() =>
								setGeneralSettings(prev => ({
									...prev,
									cellSize: DEFAULT_GENERAL_SETTINGS.cellSize,
								}))
							}
						>
							<i className='bi bi-search'></i>
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
	);
};

export default ToolBar;
