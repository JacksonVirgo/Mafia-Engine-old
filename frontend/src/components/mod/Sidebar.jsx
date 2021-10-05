import React from 'react';
import { useModeratorUpdate, PAGES, PAGE_HANDLES, ACTIONS } from '../moderatorPanels/ModeratorProvider';
import styles from '../../styles/modules/moderators.module.css';
import UnorderedList from '../lists/UnorderedList';

export default function Sidebar() {
	const dispatch = useModeratorUpdate();
	const updatePanels = (e) => {
		const textContent = e.currentTarget.textContent;
		const pageHandle = PAGE_HANDLES[textContent];
		let pageValue = null;
		for (const handle in PAGES) {
			if (PAGES[handle] === pageHandle) {
				pageValue = handle;
				break;
			}
		}

		if (pageValue) {
			dispatch({ type: ACTIONS.SET_ACTIVE_PAGE, payload: { page: PAGES[pageValue] } });
		}
	};
	return (
		<div className={styles.sidebar}>
			<h3>Tools</h3>
			<UnorderedList onChildClick={updatePanels} children={Object.keys(PAGE_HANDLES)} />
		</div>
	);
}
