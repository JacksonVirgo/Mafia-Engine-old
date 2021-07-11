import React from 'react';
import styles from '../../styles/modules/moderators.module.css';

export default function Nicknames() {
	const addNickname = (e) => {
		e.preventDefault();
	};
	return (
		<div>
			<h3>Nickname List</h3>
			<ul className={styles.panelList}>
				<li>Empty</li>
			</ul>

			<br />

			<form onSubmit={addNickname}>
				<label htmlFor='enterUsername'>Username</label>
				<input className={styles.editableInput} id='enterUsername' name='enterUsername ' type='text' placeholder='username' />
				<br />
				<label htmlFor='enterNickname'>Nickname</label>
				<input className={styles.editableInput} id='enterNickname' name='enterNickname ' type='text' placeholder='nickname' />
				<br />
				<input className={styles.editableButton} type='submit' value='Add Nickname' />
			</form>
		</div>
	);
}
