import React, { Component } from 'react';
import RolecardComponent from '../rolecard/RolecardComponent.jsx';
import SidebarButton from '../rolecard/SidebarButton.jsx';
import Papa from 'papaparse';
import { createSocket } from '../../scripts/websockets';

import Import from '../rolecard/sections/Import.jsx';
import Template from '../rolecard/sections/Template.jsx';

export default class RoleCard extends Component {
	constructor() {
		super();
		this.state = {
			import: false,
			globals: false,
			template: false,
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
	toggleTemplate() {
		this.setState({ template: !this.state.template });
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
	}
	templateChange(e) {
		this.setState({ template: e.target.value });
	}
	render() {
		/* Split later into different components */
		return (
			<div className='rolecard'>
				<div className='sidebar'>
					<SidebarButton name='Import' onclick={this.toggleImport.bind(this)} />
					<SidebarButton name='Globals' onclick={this.toggleGlobal.bind(this)} />
					<SidebarButton name='Process' onclick={this.toggleTemplate.bind(this)} />
				</div>
				<div className='content'>
					{this.state.import && <RolecardComponent child={<Import formSubmit={this.submitImport.bind(this)} />} />}
					{this.state.globals && <RolecardComponent child={<span>Global Component</span>} />}
					{this.state.template && <RolecardComponent child={<Template onChange={this.templateChange.bind(this)} />} />}
				</div>
			</div>
		);
	}
}
