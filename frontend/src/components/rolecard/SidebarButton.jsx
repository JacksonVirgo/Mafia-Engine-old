import React from 'react';
import styles from '../../css/modules/rolecard.module.css';

function SidebarButton(props) {
	const { name, onclick } = props;
	return (
		<div className='sidebarButton' onClick={onclick}>
			{name}
		</div>
	);
}

export default SidebarButton;
