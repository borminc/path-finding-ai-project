import { AStarServiceContext } from '../contexts';
import AStarSettingsModal from './aStarSettingsModal';
import React from 'react';

const ToolBar = ({ isMakingObstacles, setIsMakingObstacles, setCellSize }) => {
	const { isProcessing, generateRandomObstacles, startPathFinding, cleanGrid } =
		React.useContext(AStarServiceContext);

	return (
		<div>
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
						>
							Run
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
						>
							Clear
						</button>

						<button
							onClick={() => setIsMakingObstacles(true)}
							disabled={isProcessing}
							className='btn btn-sm btn-outline-primary me-1'
						>
							Edit obstacles
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
							-
						</button>
						<button
							type='button'
							className='btn btn-sm btn-outline-secondary'
							onClick={() => setCellSize(prev => prev + 1)}
						>
							+
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ToolBar;
