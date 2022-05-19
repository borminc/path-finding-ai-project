import { AStarServiceContext } from '../contexts';
import AStarSettingsModal from './aStarSettingsModal';
import React from 'react';

const ToolBar = ({
	isMakingObstacles,
	setIsMakingObstacles,
	setCellSize,
	...props
}) => {
	const { isProcessing, generateRandomObstacles, startPathFinding, cleanGrid } =
		React.useContext(AStarServiceContext);

	return (
		<div {...props}>
			<h5>Path-finding AI</h5>

			<div className='d-flex justify-content-between my-2'>
				{isMakingObstacles ? (
					<div>
						<button
							onClick={generateRandomObstacles}
							disabled={isProcessing}
							className='btn btn-sm btn-outline-primary me-1'
						>
							Randomize obstacles
						</button>
						<button
							onClick={() => setIsMakingObstacles(false)}
							disabled={isProcessing}
							className='btn btn-sm btn-outline-primary me-1'
						>
							Done
						</button>
					</div>
				) : (
					<div>
						<button
							onClick={startPathFinding}
							disabled={isProcessing}
							className='btn btn-sm btn-outline-primary me-1'
							title='Run'
						>
							<i className='bi bi-play-fill'></i>
						</button>

						<button
							onClick={() => {
								let a = window.confirm(
									'Everything will be lost. Are you sure?'
								);
								if (a) cleanGrid();
							}}
							disabled={isProcessing}
							className='btn btn-sm btn-outline-primary me-1'
							title='Reset'
						>
							<i className='bi bi-arrow-counterclockwise me-1'></i>
						</button>

						<button
							onClick={() => setIsMakingObstacles(true)}
							disabled={isProcessing}
							className='btn btn-sm btn-outline-primary ms-2 me-1'
							title='Edit obstacles'
						>
							<i className='bi bi-pencil'></i>
						</button>
					</div>
				)}

				<div>
					<AStarSettingsModal />

					<div className='btn-group ms-1'>
						<button
							type='button'
							className='btn btn-sm btn-outline-secondary'
							onClick={() => setCellSize(prev => prev - 1)}
						>
							<i className='bi bi-zoom-out'></i>
						</button>
						<button
							type='button'
							className='btn btn-sm btn-outline-secondary'
							onClick={() => setCellSize(prev => prev + 1)}
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
