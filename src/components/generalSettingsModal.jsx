import { cloneDeep } from 'lodash';
import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { GeneralSettingsContext } from '../contexts';
import { DEFAULT_GENERAL_SETTINGS } from '../utils';

const GeneralSettingsModal = ({ ...props }) => {
	const [generalSettings, setGeneralSettings] = React.useContext(
		GeneralSettingsContext
	);

	const [selectedColorKey, setSelectedColorKey] = React.useState(null);

	const colorPickerChangeHandler = color => {
		if (!selectedColorKey) return;
		setGeneralSettings(prev => ({
			...prev,
			colors: {
				...prev.colors,
				[selectedColorKey]: color,
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
												onChange={() => setSelectedColorKey(key)}
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

								{selectedColorKey && (
									<HexColorPicker
										className='my-3'
										color={generalSettings.colors[selectedColorKey]}
										onChange={colorPickerChangeHandler}
									/>
								)}

								<button
									className='btn btn-link'
									onClick={() => {
										setGeneralSettings(prev => {
											prev.colors = DEFAULT_GENERAL_SETTINGS.colors;
											return cloneDeep(prev);
										});
									}}
								>
									Reset
								</button>
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
