import { toNumber } from 'lodash';
import React from 'react';
import AStar from './lib/aStar.mjs';
import Grid from './lib/grid.mjs';

const AStarSettingsModal = ({ aStar, setAStar, settings, setSettings }) => {
	const [form, setForm] = React.useState({
		width: aStar.grid.width,
		height: aStar.grid.height,
		...settings,
	});

	return (
		<>
			<button
				type='button'
				className='btn btn-sm btn-outline-secondary'
				data-bs-toggle='modal'
				data-bs-target='#settings'
			>
				Settings
			</button>

			<div
				className='modal fade'
				id='settings'
				tabIndex='-1'
				aria-labelledby='setting-label'
				aria-hidden='true'
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
							<div className='input-group mb-3'>
								<div className='input-group-text'>Cell size</div>
								<div className='btn-group me-3'>
									<button
										type='button'
										className='btn btn-sm btn-outline-secondary'
										onClick={() =>
											setSettings({
												...settings,
												cellSize: settings.cellSize - 1,
											})
										}
									>
										-
									</button>
									<button
										type='button'
										className='btn btn-sm btn-outline-secondary'
										onClick={() =>
											setSettings({
												...settings,
												cellSize: settings.cellSize + 1,
											})
										}
									>
										+
									</button>
								</div>
							</div>

							<hr />

							<div className='input-group mb-3'>
								<div className='input-group-text'>Grid width & height</div>
								<input
									type='text'
									className='form-control'
									placeholder='Width'
									value={form.width}
									onChange={e =>
										setForm({
											...form,
											width: toNumber(e.target.value) || 0,
										})
									}
								/>
								<input
									type='text'
									className='form-control'
									placeholder='Height'
									value={form.height}
									onChange={e =>
										setForm({
											...form,
											height: toNumber(e.target.value) || 0,
										})
									}
								/>
							</div>

							<div className='input-group mb-3'>
								<div className='input-group-text'>Num. of obstacles</div>
								<input
									type='text'
									className='form-control'
									placeholder='Number of obstacles'
									value={form.numberOfObstacles}
									onChange={e =>
										setForm({
											...form,
											numberOfObstacles: toNumber(e.target.value) || 0,
										})
									}
								/>
							</div>

							<div className='input-group mb-3'>
								<div className='input-group-text'>Render speed (ms)</div>
								<input
									type='text'
									className='form-control'
									placeholder='Render speed (ms)'
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

						<div className='modal-footer'>
							<button
								type='button'
								className='btn btn-secondary'
								data-bs-dismiss='modal'
							>
								Close
							</button>
							<button
								type='button'
								className='btn btn-primary'
								data-bs-dismiss='modal'
								onClick={() => {
									const { width, height, ...rest } = form;
									const newAStar = new AStar(new Grid(width, height));

									setAStar(newAStar);
									setSettings(rest);
								}}
							>
								Apply
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AStarSettingsModal;
