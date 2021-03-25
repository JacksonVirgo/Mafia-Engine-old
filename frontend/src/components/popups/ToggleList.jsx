import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import Dropdown from 'react-drop-down';
import 'reactjs-popup/dist/index.css';

export default (props) => {
	let [value, setValue] = useState(props.options[0] ? props.options[0] : '[ERROR]');

	const onChange = (data) => {
		setValue(data);
	};
	const onToggle = () => {
		console.log('f', value);
		props.onChange(value);
	};
	return (
		<Popup trigger={<button type='button'>{props.name}</button>}>
			<div>
				<Dropdown value={value} onChange={onChange} options={props.options} />
				<button type='button' onClick={onToggle}>
					Toggle
				</button>
			</div>
		</Popup>
	);
};
