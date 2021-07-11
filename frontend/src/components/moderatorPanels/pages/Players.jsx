import React from 'react';
import { useModerator, PAGES } from '../ModeratorProvider';

import ModPanel from '../../mod/ModPanel';
import styles from '../../../styles/modules/moderators.module.css';
import PlayerPanel from '../Players';
import NicknamesPanel from '../Nicknames';
import ReplacementPanel from '../Replacement';
const PlayerPage = () => {
	const modState = useModerator();

	return (
		<div className={styles.modPage} style={{ display: modState.activePage === PAGES.PLAYERS ? 'block' : 'none' }}>
			<ModPanel title={'Player List'} child={<PlayerPanel />} />
			<ModPanel title='Nicknames' child={<NicknamesPanel />} />
			<ModPanel title='Replacements' child={<ReplacementPanel />} />
		</div>
	);
};

export default PlayerPage;
