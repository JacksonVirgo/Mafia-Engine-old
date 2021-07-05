import React from 'react';
import { useModerator, useModeratorUpdate, ACTIONS } from './ModeratorProvider';
import styles from '../../styles/modules/moderators.module.css';

export default function Thread() {
	const state = useModerator();
	const dispatch = useModeratorUpdate();

	const setThread = (e) => {
		e.preventDefault();
		const enterThreadURL = e.target.enterThreadURL.value;
		dispatch({ type: ACTIONS.THREAD_CHANGE, payload: { thread: enterThreadURL } });
	};
	return (
		<div>
			<h3>Thread Details</h3>
			<div>{state.thread}</div>
			<br />
			<form onSubmit={setThread}>
				<label htmlFor='enterThreadURL'>Enter Thread URL</label>
				<input className={styles.editableInput} id='enterThreadURL' name='enterThreadURL ' type='text' placeholder='thread url' />
				<br />
				<input className={styles.editableButton} type='submit' value='Set Thread' />
			</form>
		</div>
	);
}
