import React from 'react';
import { useModerator, useModeratorUpdate, ACTIONS } from './ModeratorProvider';

import styles from '../../styles/modules/moderators.module.css';
export default function Players() {
	const state = useModerator();
	const dispatch = useModeratorUpdate();

	//const [users, setUsers] = useState(['JacksonVirgo', 'yessiree', 'Psyche', 'chamber', 'osuka', 'Flubbernugget']);
	const addUser = (e) => {
		e.preventDefault();
		const user = e.target.enterUsername.value;
		dispatch({ type: ACTIONS.ADD_PLAYER, payload: { players: [user] } });
		e.target.enterUsername.value = '';
	};
	return (
		<div>
			<h3>Player List [{state.players.length || 0}p]</h3>
			<ul className={styles.panelList}>
				{state.players.map((v, i) => (
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
