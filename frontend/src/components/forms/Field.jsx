import React from 'react';

export default function Field(props) {
	const { child } = props;
	return <div className='field'>{child}</div>;
}
