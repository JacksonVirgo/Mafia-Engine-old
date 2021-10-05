import React from 'react';
import styles from '../../styles/modules/moderators.module.css';

export default function Replacement() {
	const addReplacement = (e) => {
		e.preventDefault();
	};
	return (
		<div>
			<h3>Replacement List</h3>
			<ul className={styles.panelList}>
				<li>Empty</li>
			</ul>

			<br />

			<form onSubmit={addReplacement}>
				<label htmlFor='enterUsername'>Old Player</label>
				<input className={styles.editableInput} id='enterUsername' name='enterUsername ' type='text' placeholder='Old User' />
				<br />
				<label htmlFor='enterReplacement'>New Player</label>
				<input className={styles.editableInput} id='enterReplacement' name='enterReplacement ' type='text' placeholder='New User' />
				<br />
				<input className={styles.editableButton} type='submit' value='Add Replacement' />
			</form>
		</div>
	);
}
