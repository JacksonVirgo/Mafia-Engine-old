import React from 'react';
import styles from '../../styles/modules/moderators.module.css';

export default function Replacement() {
	const generateReplacement = (e) => {
		e.preventDefault();
	};
	return (
		<div>
			<h3>Replacement Form</h3>
			<form onSubmit={generateReplacement}>
				<label htmlFor='enterReplacedPlayer'>Replaced Player</label>
				<input className={styles.editableInput} id='enterReplacedPlayer' name='enterReplacedPlayer ' type='text' placeholder='replaced player name' />
				<input className={styles.editableButton} type='submit' value='Generate Replacement Post' />
			</form>
		</div>
	);
}
