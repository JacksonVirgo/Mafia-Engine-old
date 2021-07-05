import React from 'react';
import styles from '../../styles/modules/moderators.module.css';

export default function ModeratorPanel({ title, child, visible = true }) {
	console.log(visible);
	return (
		<div className={styles.modpanel} style={{ display: visible ? 'block' : 'none' }}>
			<span>{title}</span>
			<div className={styles.panelBody}>{child}</div>
		</div>
	);
}
