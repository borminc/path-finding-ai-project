import { toNumber } from 'lodash';
import React from 'react';
import { SettingsContext } from '../contexts';

const AStarSettingsModal = () => {
	const [settings, setSettings] = React.useContext(SettingsContext);
	const [form, setForm] = React.useState(settings);

	React.useEffect(() => {
		setForm(settings);
	}, [settings]);

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
				<form
					onSubmit={e => {
						e.preventDefault();
						setSettings({
							...settings,
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
								<div className='input-group mb-3'>
									<div className='input-group-text'>Grid width & height</div>
									<input
										type='text'
										className='form-control'
										placeholder='Width'
										value={form.gridWidth}
										onChange={e =>
											setForm({
												...form,
												gridWidth: toNumber(e.target.value) || 0,
											})
										}
									/>
									<input
										type='text'
										className='form-control'
										placeholder='Height'
										value={form.gridHeight}
										onChange={e =>
											setForm({
												...form,
												gridHeight: toNumber(e.target.value) || 0,
											})
										}
									/>
								</div>

								<div className='input-group mb-3'>
									<div className='input-group-text'>
										Num. of random obstacles
									</div>
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

								<div className='form-check mb-3'>
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
