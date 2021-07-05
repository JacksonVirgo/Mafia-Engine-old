import React from 'react';
import { Redirect } from 'react-router';
import styles from '../styles/modules/moderators.module.css';
import ModPanel from '../components/mod/ModPanel';
import hamburgerIcon from '../resources/list.png';
import UnorderedList from '../components/lists/UnorderedList';

import PlayerPanel from '../components/moderatorPanels/Players';
import ThreadPanel from '../components/moderatorPanels/Thread';
import ReplacementPanel from '../components/moderatorPanels/Replacement';

import ModPage from '../components/mod/ModPage';

import ModeratorProvider from '../components/moderatorPanels/ModeratorProvider';

import { GlobalContext } from '../GlobalProvider';

/*
PANELS
- Nicknames
- PM Creator / Semi-Automatic Sending
- Setup Storage
- Game Randing
- Night Action Resolution
*/

export const ModeratorContext = React.createContext();

export default class ModeratorPanel extends React.Component {
	constructor() {
		super();
		this.state = {
			menuActive: true,
			tabList: [],
			playerList: [],
			threadURL: '',
		};

		this.bindFunctions = this.bindFunctions.bind(this);
		this.bindFunctions();
	}
	componentDidMount() {
		const currentJWT = this.context.jwt;
		if (currentJWT) {
			this.createTabInit('Players', <PlayerPanel />);
			this.createTabInit('Thread Data', <ThreadPanel />);
			this.createTabInit('Replacement', <ReplacementPanel />);
		} else {
		}
	}
	bindFunctions() {
		this.hamburgerClicked = this.hamburgerClicked.bind(this);
		this.updateModPanel = this.updateModPanel.bind(this);
		this.getModPanel = this.getModPanel.bind(this);
		this.createTab = this.createTab.bind(this);
		this.createTabInit = this.createTabInit.bind(this);
	}

	addPlayers(arr) {
		this.setState({ playerList: [].concat(this.state.playerList, arr) });
	}
	createTab(title, panel) {
		const newState = {};
		newState[`flag${title}`] = this.state[`flag${title}`] || false;
		newState[`panel${title}`] = <ModPanel title={JSON.stringify(this.state.menuActive)} style={{ display: this.state[`flag${title}`] ? 'block' : 'none' }} child={panel} />;
		this.setState(newState);
	}
	createTabInit(title, panel) {
		const newState = {};
		newState[`flag${title}`] = this.state[`flag${title}`] || false;
		newState[`panel${title}`] = <ModPanel key={title} title={title} visible={true} child={panel} />;
		this.setState(newState);
	}
	hamburgerClicked() {
		this.setState({ menuActive: !this.state.menuActive });
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
			const flagValue = 'flag' + panelType;
			const state = {};
			state[`flag${panelType}`] = !this.state[flagValue];
			this.setState(state);

			console.log(this.state);
		}
	}
	render() {
		const hasJWT = !!this.context.jwt;
		if (hasJWT) {
		}

		const tabArray = [<ModPanel key='1' title='Thread' child={<ThreadPanel />} />, <ModPanel key='2' title='Replacement' child={<ReplacementPanel />} />, <ModPanel key='3' title='Players' child={<PlayerPanel />} />];

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
							<UnorderedList onChildClick={this.updateModPanel} children={['Players', 'Thread Data', 'Replacement']} />
						</div>
					)}
					<div className={styles.content}>
						<ModeratorProvider>
							<ModPage column1={tabArray} />
						</ModeratorProvider>
					</div>
				</div>
			</div>
		);

		return content;
	}
}

ModeratorPanel.contextType = GlobalContext;
