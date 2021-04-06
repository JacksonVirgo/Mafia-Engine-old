import React from 'react';

function SidebarButton(props) {
	const { name, onclick } = props;
	return (
		<div className='sidebarButton' onClick={onclick}>
			{name}
		</div>
	);
}

export default SidebarButton;
