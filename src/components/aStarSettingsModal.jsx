import { toNumber } from 'lodash';
import React from 'react';
import { AStarServiceContext, AStarSettingsContext } from '../contexts';

const AStarSettingsModal = ({ ...props }) => {
	const [aStarSettings, setAStarSettings] =
		React.useContext(AStarSettingsContext);
	const [form, setForm] = React.useState(aStarSettings);
	const aStarService = React.useContext(AStarServiceContext);

	React.useEffect(() => {
		setForm(aStarSettings);
	}, [aStarSettings]);

	return (
		<>
			<button
				type='button'
				className={`btn btn-sm btn-outline-secondary ${props?.className ?? ''}`}
				disabled={aStarService.isProcessing}
				data-bs-toggle='modal'
				data-bs-target='#a-start-settings'
			>
				<i className='bi bi-star'></i>
			</button>

			<div
				className='modal fade'
				id='a-start-settings'
				tabIndex='-1'
				aria-labelledby='setting-label'
				aria-hidden='true'
			>
				<form
					onSubmit={e => {
						e.preventDefault();
						setAStarSettings({
							...aStarSettings,
							...form,
						});
					}}
				>
					<div className='modal-dialog'>
						<div className='modal-content'>
							<div className='modal-header'>
								<h5 className='modal-title' id='setting-label'>
									A* Settings
								</h5>
								<button
									type='button'
									className='btn-close'
									data-bs-dismiss='modal'
									aria-label='Close'
								></button>
							</div>
							<div className='modal-body'>
								<div className='mb-3'>
									<div>
										<label for='grid-width' class='form-label'>
											Grid width: {form.gridWidth} cells
										</label>
										<input
											id='grid-width'
											type='range'
											class='form-range'
											min='10'
											max='200'
											step='5'
											value={form.gridWidth}
											onChange={e => {
												const value = e.target.value;
												const maxObstacles = value * form.gridHeight - 2;

												setForm({
													...form,
													gridWidth: toNumber(value) || 0,
													numberOfObstacles:
														maxObstacles < form.numberOfObstacles
															? maxObstacles
															: form.numberOfObstacles,
												});
											}}
										/>
									</div>

									<div>
										<label for='grid-height' class='form-label'>
											Grid height: {form.gridHeight} cells
										</label>
										<input
											id='grid-height'
											type='range'
											class='form-range'
											min='10'
											max='200'
											step='5'
											value={form.gridHeight}
											onChange={e => {
												const value = e.target.value;
												const maxObstacles = value * form.gridWidth - 2;

												setForm({
													...form,
													gridHeight: toNumber(value) || 0,
													numberOfObstacles:
														maxObstacles < form.numberOfObstacles
															? maxObstacles
															: form.numberOfObstacles,
												});
											}}
										/>
									</div>

									{form.gridWidth * form.gridHeight > 10000 && (
										<div className='mb-3'>
											<small className='text-danger'>
												Performance of grids containing over 10,000 cells may be
												affected depending on your system.
											</small>
										</div>
									)}

									<div>
										<label for='num-obstacles' class='form-label'>
											Num. of random obstacles: {form.numberOfObstacles} cells
										</label>
										<input
											id='num-obstacles'
											type='range'
											class='form-range'
											min='0'
											max={form.gridWidth * form.gridHeight - 2} // 2 for start and end cells
											step='5'
											value={form.numberOfObstacles}
											onChange={e =>
												setForm({
													...form,
													numberOfObstacles: toNumber(e.target.value) || 0,
												})
											}
										/>
									</div>

									<div>
										<label for='render-speed' class='form-label'>
											Render speed: {form.renderSpeed} ms
										</label>
										<input
											id='render-speed'
											type='range'
											class='form-range'
											min='0'
											max='10000'
											step='5'
											value={form.renderSpeed}
											onChange={e =>
												setForm({
													...form,
													renderSpeed: toNumber(e.target.value) || 0,
												})
											}
										/>
									</div>
								</div>

								<div className='form-check form-switch mb-3'>
									<input
										className='form-check-input'
										type='checkbox'
										id='allowDiagonalNeighbors'
										value=''
										checked={form.allowDiagonalNeighbors}
										onChange={e => {
											setForm({
												...form,
												allowDiagonalNeighbors: e.target.checked,
											});
										}}
									/>
									<label
										className='form-check-label'
										htmlFor='allowDiagonalNeighbors'
									>
										Allow diagonal movements
									</label>
								</div>

								<div>
									<small className='text-danger'>
										All current states will be lost when changes are applied.
									</small>
								</div>
							</div>

							<div className='modal-footer'>
								<button
									type='button'
									className='btn btn-secondary'
									data-bs-dismiss='modal'
								>
									Close
								</button>
								<button
									type='submit'
									className='btn btn-primary'
									data-bs-dismiss='modal'
								>
									Apply
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	);
};

export default AStarSettingsModal;
