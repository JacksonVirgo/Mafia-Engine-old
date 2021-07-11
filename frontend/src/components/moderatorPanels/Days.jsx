import React from 'react';
import styles from '../../styles/modules/moderators.module.css';

export default function Days() {
	const setDayPost = (e) => {
		e.preventDefault();
	};
	return (
		<div>
			<h3>Days</h3>
			<ul className={styles.panelList}></ul>

			<br />

			<form onSubmit={setDayPost}>
				<label htmlFor='enterDayNumber'>Enter Day #</label>
				<input className={styles.editableInput} id='enterDayNumber' name='enterDayNumber ' type='text' placeholder='Day Number' />
				<br />
				<label htmlFor='enterPostNumber'>Enter Post #</label>
				<input className={styles.editableInput} id='enterPostNumber' name='enterPostNumber ' type='text' placeholder='Post Number' />
				<br />
				<input className={styles.editableButton} type='submit' value='Set Day' />
			</form>
		</div>
	);
}
