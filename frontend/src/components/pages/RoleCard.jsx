import React, { Component } from 'react';
import RolecardComponent from '../rolecard/RolecardComponent.jsx';
import SidebarButton from '../rolecard/SidebarButton.jsx';
import Import from '../rolecard/sections/Import.jsx';
import Papa from 'papaparse';
import { createSocket } from '../../scripts/websockets';

export default class RoleCard extends Component {
	constructor() {
		super();
		this.state = {
			import: false,
			globals: false,
			roleData: [],
		};
		this.socket = createSocket();
	}
	toggleImport() {
		this.setState({ import: !this.state.import });
	}
	toggleGlobal() {
		this.setState({ globals: !this.state.globals });
	}
	submitImport(e) {
		e.preventDefault();
		try {
			let file = e.target.file.files[0];
			Papa.parse(file, {
				download: true,
				header: true,
				skipEmptyLines: true,
				complete: (res) => {
					let roles = [];
					for (const data of res.data) roles.push(data);
					this.setState({ roleData: this.state.roleData });
				},
			});
		} catch (err) {
			console.log('Invalid File');
		}
		console.log(this.state.roleData);
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
					{this.state.import && <RolecardComponent child={<Import formSubmit={this.submitImport.bind(this)} />} />}
					{this.state.globals && <RolecardComponent child={<span>Global Component</span>} />}
				</div>
			</div>
		);
	}
}
