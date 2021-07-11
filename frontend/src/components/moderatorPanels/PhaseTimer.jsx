import React, { useState } from 'react';
import styles from '../../styles/modules/moderators.module.css';
import TimezoneSelect from 'react-timezone-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function PhaseTimer() {
	const [timezone, setTimezone] = useState({});
	const [startDate, setStartDate] = useState(new Date());
	const setPhaseTimer = (e) => {
		e.preventDefault();
	};
	return (
		<div>
			<h3>Phase Deadline</h3>
			<div>-- In Development --</div>
			{/* <h3>Phase Deadline</h3>
			<div>{JSON.stringify(timezone)}</div>
			<div>{startDate.toUTCString()}</div>
			<br />
			<TimezoneSelect className={styles.timezone} value={timezone} onChange={setTimezone} />
			<br />
			<DatePicker className={styles.timezone} selected={startDate} onChange={(date) => setStartDate(date)} />
			<br />
			<form onSubmit={setPhaseTimer}>
				<input className={styles.editableButton} type='submit' value='Set Phase Deadline' />
			</form> */}
		</div>
	);
}
