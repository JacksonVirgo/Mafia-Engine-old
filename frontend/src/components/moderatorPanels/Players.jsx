import React, { useState } from 'react';
import styles from '../../styles/modules/moderators.module.css';
export default function Players() {
	const [users, setUsers] = useState(['JacksonVirgo', 'yessiree', 'Psyche', 'chamber', 'osuka', 'Flubbernugget']);
	const addUser = (e) => {
		e.preventDefault();
		const user = e.target.enterUsername.value;
		if (user.length >= 1) setUsers([].concat(users, [user]));
		e.target.enterUsername.value = '';
		console.log(users);
	};
	return (
		<div>
			<h3>Player List</h3>
			<ul className={styles.panelList}>
				{users.map((v, i) => (
					<li key={i}>
						{i + 1 + ') '}
						{v}
					</li>
				))}
			</ul>

			<br />

			<form onSubmit={addUser}>
				<label htmlFor='enterUsername'>Enter new Username</label>
				<input className={styles.editableInput} id='enterUsername' name='enterUsername ' type='text' placeholder='username' />
				<input className={styles.editableButton} type='submit' value='Add User' />
			</form>
		</div>
	);
}
