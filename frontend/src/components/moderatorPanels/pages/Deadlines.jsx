import React from 'react';
import { useModerator, PAGES } from '../ModeratorProvider';

import ModPanel from '../../mod/ModPanel';
import styles from '../../../styles/modules/moderators.module.css';
import ProdPanel from '../Prods';
import PhaseDeadlinePanel from '../PhaseTimer';
const DeadlinesPage = () => {
	const modState = useModerator();

	return (
		<div className={styles.modPage} style={{ display: modState.activePage === PAGES.DEADLINES ? 'block' : 'none' }}>
			<ModPanel title='Phase Deadline' child={<PhaseDeadlinePanel />} />
			<ModPanel title='Prod Timer' child={<ProdPanel />} />
		</div>
	);
};

export default DeadlinesPage;
