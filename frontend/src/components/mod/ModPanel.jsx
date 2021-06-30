import React from 'react';
import styles from '../../styles/modules/moderators.module.css';

export default function ModeratorPanel({ title, child, visible }) {
	return (
		<div className={styles.modpanel}>
			<span>{title}</span>
			<div className={styles.panelBody}>{child}</div>
		</div>
	);
}
