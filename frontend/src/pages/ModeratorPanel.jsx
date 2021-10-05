import React from 'react';
import styles from '../styles/modules/moderators.module.css';
import hamburgerIcon from '../resources/list.png';
import ModeratorProvider from '../components/moderatorPanels/ModeratorProvider';
import { GlobalContext } from '../GlobalProvider';
import Sidebar from '../components/mod/Sidebar';

import ThreadPage from '../components/moderatorPanels/pages/Thread';
import PlayerPage from '../components/moderatorPanels/pages/Players';
import DeadlinesPage from '../components/moderatorPanels/pages/Deadlines';

export default class ModeratorPanel extends React.Component {
	constructor() {
		super();
		this.state = {
			menuActive: true,
		};

		this.bindFunctions = this.bindFunctions.bind(this);
		this.bindFunctions();
	}
	componentDidMount() {}
	bindFunctions() {
		this.hamburgerClicked = this.hamburgerClicked.bind(this);
		this.updateModPanel = this.updateModPanel.bind(this);
	}
	hamburgerClicked() {
		this.setState({ menuActive: !this.state.menuActive });
	}
	updateModPanel(e) {}
	render() {
		const content = (
			<div className={styles.mainDiv}>
				<div className={styles.header}>
					<span onClick={this.hamburgerClicked}>
						<img src={hamburgerIcon} alt='Toggle Sidebar' />
					</span>
					<a href='../'>Home</a>
				</div>
				<ModeratorProvider>
					<div className={styles.body}>
						{this.state.menuActive && <Sidebar />}
						<div className={styles.content}>
							<ThreadPage />
							<PlayerPage />
							<DeadlinesPage />
						</div>
					</div>{' '}
				</ModeratorProvider>
			</div>
		);

		return content;
	}
}

ModeratorPanel.contextType = GlobalContext;
