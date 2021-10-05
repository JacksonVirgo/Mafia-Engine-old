import React from 'react';
import styles from '../../styles/modules/moderators.module.css';

export default function ModPage({ column1 = [], column2 = [] }) {
	return (
		<div className={styles.modPage}>
			{column1.length > 0 && <div>{column1.map((v) => v)}</div>}
			{column2.length > 0 && <div>{column2.map((v) => v)}</div>}
		</div>
	);
}
