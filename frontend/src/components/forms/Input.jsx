import React from 'react';

export default (props) => {
	const { name, label, type } = props;
	return (
		<>
			<label htmlFor={name}>{label}</label>
			<input id={props.name} type={props.type} />
		</>
	);
};
