import React, { Component } from 'react';
import styles from '../../css/modules/rolecard.module.css';
import RolecardComponent from '../rolecard/RolecardComponent.jsx';
import SidebarButton from '../rolecard/SidebarButton.jsx';

export default class RoleCard extends Component {
	constructor() {
		super();
		this.state = {
			import: false,
			globals: false,
		};
	}
	toggleImport() {
		this.setState({ import: !this.state.import });
	}
	toggleGlobal() {
		this.setState({ globals: !this.state.globals });
	}
	render() {
		/* Split later into different components */
		return (
			<div className='rolecard'>
				<div className='sidebar'>
					<SidebarButton name='Import' onclick={this.toggleImport.bind(this)} />
					<SidebarButton name='Globals' onclick={this.toggleGlobal.bind(this)} />
				</div>
				<div className='content'>
					{this.state.import && <RolecardComponent child={<span>Import Component</span>} />}
					{this.state.globals && <RolecardComponent child={<span>Global Component</span>} />}
				</div>
			</div>
		);
	}
}
