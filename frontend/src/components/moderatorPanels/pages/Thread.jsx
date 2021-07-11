import React from 'react';
import { useModerator, PAGES } from '../ModeratorProvider';

import ModPanel from '../../mod/ModPanel';
import styles from '../../../styles/modules/moderators.module.css';

import ThreadPanel from '../Thread';
import DaysPanel from '../Days';
const ThreadPage = () => {
	const modState = useModerator();

	return (
		<div className={styles.modPage} style={{ display: modState.activePage === PAGES.THREAD ? 'block' : 'none' }}>
			<ModPanel title={'Thread URL'} child={<ThreadPanel />} />
			<ModPanel title={'Day Starts'} child={<DaysPanel />} />
		</div>
	);
};

export default ThreadPage;
