import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { GeneralSettingsContext } from '../contexts';
import { DEFAULT_GENERAL_SETTINGS } from '../utils';

const GeneralSettingsModal = ({ ...props }) => {
	const [generalSettings, setGeneralSettings] = React.useContext(
		GeneralSettingsContext
	);

	const [selectedColor, setSelectedColor] = React.useState(null); // e.g., { key: 'cell', value: 'white' }

	const colorPickerChangeHandler = color => {
		if (!selectedColor) return;

		setGeneralSettings(prev => ({
			...prev,
			colors: {
				...prev.colors,
				[selectedColor.key]: color,
			},
		}));
	};

	return (
		<>
			<button
				type='button'
				className={`btn btn-sm btn-outline-secondary ${props?.className ?? ''}`}
				data-bs-toggle='modal'
				data-bs-target='#general-settings'
			>
				<i className='bi bi-gear'></i>
			</button>

			<div
				className='modal fade'
				id='general-settings'
				tabIndex='-1'
				aria-labelledby='setting-label'
				aria-hidden='true'
			>
				<div className='modal-dialog'>
					<div className='modal-content'>
						<div className='modal-header'>
							<h5 className='modal-title' id='setting-label'>
								General Settings
							</h5>
							<button
								type='button'
								className='btn-close'
								data-bs-dismiss='modal'
								aria-label='Close'
							></button>
						</div>
						<div className='modal-body'>
							<div>
								<h5>Appearance</h5>

								<div className='d-flex justify-content-between align-items-start'>
									<div>
										{Object.entries(generalSettings.colors).map(
											([key, value], i) => (
												<div key={i} className='form-check'>
													<input
														className='form-check-input'
														name='colors'
														type='radio'
														id={`color-${key}`}
														data-key={key}
														value={value}
														onChange={() => setSelectedColor({ key, value })}
													/>
													<label
														className='form-check-label d-flex align-items-center'
														htmlFor={`color-${key}`}
													>
														<div
															className='me-2'
															style={{
																width: '1em',
																height: '1em',
																background: value,
															}}
														></div>
														{key}
													</label>
												</div>
											)
										)}

										<button
											className='btn btn-link m-0 p-0 mt-2'
											onClick={() => {
												setGeneralSettings(prev => {
													return {
														...prev,
														colors: DEFAULT_GENERAL_SETTINGS.colors,
													};
												});
												setSelectedColor(null);
											}}
										>
											Reset
										</button>
									</div>

									<div>
										<HexColorPicker
											key={selectedColor?.key || 'color-picker'}
											color={selectedColor?.value || 'white'}
											onChange={colorPickerChangeHandler}
										/>
									</div>
								</div>
							</div>

							<div className='mt-4'>
								<h5>Game</h5>

								<div className='form-check form-switch mb-3'>
									<input
										className='form-check-input'
										type='checkbox'
										id='continuousPlayMode'
										value=''
										checked={generalSettings.continuousPlayMode}
										onChange={e => {
											setGeneralSettings(prev => ({
												...prev,
												continuousPlayMode: e.target.checked,
											}));
										}}
									/>
									<label
										className='form-check-label'
										htmlFor='continuousPlayMode'
									>
										Continuous play mode (auto reset grid)
									</label>
								</div>
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
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default GeneralSettingsModal;
