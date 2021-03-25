import React from 'react';

export default (props) => {
	const { child } = props;
	return <div className='field'>{child}</div>;
};
