import React, { Component } from 'react';
import RolecardComponent from '../rolecard/RolecardComponent.jsx';
import SidebarButton from '../rolecard/SidebarButton.jsx';
import Papa from 'papaparse';
import { createSocket } from '../../scripts/websockets';

import roleCardConfig from '../../config/roleCardConfig';

import Import from '../rolecard/sections/Import.jsx';
import Template from '../rolecard/sections/Template.jsx';

export default class RoleCard extends Component {
	constructor() {
		super();
		this.state = {
			showImport: false,
			showGlobals: false,
			showTemplate: false,
			roleData: [],
		};
		this.socket = createSocket();
	}
	toggleImport() {
		this.setState({ import: !this.state.showImport });
	}
	toggleGlobal() {
		this.setState({ globals: !this.state.showGlobals });
	}
	toggleTemplate() {
		this.setState({ template: !this.state.showTemplate });
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
					{this.state.showImport && <RolecardComponent child={<Import formSubmit={this.submitImport.bind(this)} />} />}
					{this.state.showGlobals && <RolecardComponent child={<span>Global Component</span>} />}
					{this.state.showTemplate && <RolecardComponent child={<Template onChange={this.templateChange.bind(this)} template={roleCardConfig.template} />} />}
				</div>
			</div>
		);
	}
}
