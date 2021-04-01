import React from 'react';

function RolecardComponent(props) {
	const { child } = props;
	return <div className={'component'}>{child}</div>;
}

export default RolecardComponent;
