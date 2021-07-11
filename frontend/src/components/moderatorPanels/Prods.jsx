import React from 'react';
import { useModerator, useModeratorUpdate, ACTIONS } from './ModeratorProvider';
import { msToTime, milliseconds } from '../../scripts/dateUtilities';
import styles from '../../styles/modules/moderators.module.css';

export default function Thread() {
	const state = useModerator();
	const dispatch = useModeratorUpdate();

	const setProdTimer = (e) => {
		e.preventDefault();
		const prodTimer = e.target.enterProdTime.value;
		dispatch({ type: ACTIONS.SET_PROD_TIMER, payload: { prodTimer: milliseconds(prodTimer, 0, 0) } });
		e.target.enterProdTime.value = '';
	};
	return (
		<div>
			<h3>Prod Timer</h3>
			<div>{`${msToTime(state.prodTimer).hours} hours` || '[Not Set]'}</div>
			<br />
			<form onSubmit={setProdTimer}>
				<label htmlFor='enterProdTime'>Prod Length in Hours</label>
				<input className={styles.editableInput} type='text' sname='enterProdTime' id='enterProdTime' placeholder='Time in Hours' />

				<br />
				<input className={styles.editableButton} type='submit' value='Set Prod Timer' />
			</form>
		</div>
	);
}
