import React from 'react';
import styles from '../styles/modules/moderators.module.css';
import ModPanel from '../components/mod/ModPanel';
import hamburgerIcon from '../resources/list.png';
import UnorderedList from '../components/lists/UnorderedList';

import PlayerPanel from '../components/moderatorPanels/Players';

export default class ModeratorPanel extends React.Component {
	constructor() {
		super();
		this.state = {};
		this.state.menuActive = true;
		this.state.tabActivity = {
			Rolecards: true,
		};
		this.state.activeTabs = [{ title: 'Rolecards', panel: <ModPanel title='Players' style={{ display: this.state.tabActivity.Rolecards ? 'block' : 'none' }} child={<PlayerPanel />} /> }];

		this.hamburgerClicked = this.hamburgerClicked.bind(this);
		this.updateModPanel = this.updateModPanel.bind(this);
		this.getModPanel = this.getModPanel.bind(this);
	}
	hamburgerClicked(e) {
		this.setState({
			menuActive: !this.state.menuActive,
		});
	}
	getModPanel(panelType) {
		if (!panelType) return null;
		const panel = this.state.activeTabs[panelType] || null;
		if (panel) return { panel, title: panelType };
		return null;
	}
	updateModPanel(e) {
		const panelType = e.target.innerHTML;
		if (panelType) {
			const tabActivity = this.state.tabActivity;
			console.log(tabActivity);
			if (tabActivity[panelType]) tabActivity[panelType] = !tabActivity[panelType];
			this.setState({ tabActivity });
		}
	}
	render() {
		const content = (
			<div className={styles.mainDiv}>
				<div className={styles.header}>
					<span onClick={this.hamburgerClicked}>
						<img src={hamburgerIcon} alt='Toggle Sidebar' />
					</span>
					<a href='../'>Home</a>
				</div>
				<div className={styles.body}>
					{this.state.menuActive && (
						<div className={styles.sidebar}>
							<h3>Tools</h3>
							<UnorderedList onChildClick={this.updateModPanel} children={['Rolecards', 'Settings']} />
						</div>
					)}
					<div className={styles.content}>
						{this.state.activeTabs.map((v, i) => (
							<div key={i}>{v.panel}</div>
						))}
					</div>
				</div>
			</div>
		);

		return content;
	}
}
