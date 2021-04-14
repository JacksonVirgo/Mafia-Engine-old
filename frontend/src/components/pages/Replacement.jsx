import React from 'react';
import { createSocket } from '../../scripts/websockets';
import { getCalendarDate } from '../../scripts/dateUtilities';
import Modal from './Modal';
import Form from '../forms/Form';
export default class Replacement extends React.Component {
	constructor() {
		super();
		this.state = {
			result: '',
			progress: '',
		};
		this.departing = null;
		this.socket = createSocket();
		this.socket.on('replacement', this.onReplacement.bind(this));
	}
	onSubmit(e) {
		e.preventDefault();
		const url = e.target.url.value;
		this.departing = e.target.departing.value;
		this.socket.emit('replacement', { url });
		this.setState({ progress: '[pending]', result: 'Pending...' });
	}
	onReplacement = (e) => {
		const { author, lastPage, title, url } = e;
		let today = getCalendarDate();
		let result = `${today}\n[i][url=${url}]${title}[/url][/i]\n[b]Moderator:[/b] [user]${author}[/user][tab]3[/tab][tab]3[/tab][b]Status:[/b] ${lastPage} pages [tab]3[/tab] [b]Replacing:[/b] [user]${this.departing}[/user]`;
		this.setState({ result, progress: '' });
	};
	render() {
		return (
			<Modal
				title='Replacement Form'
				children={[
					<Form
						key='replacementForm'
						onSubmit={this.onSubmit.bind(this)}
						submitText='Generate'
						children={[
							{ name: 'url', label: 'Game URL', type: 'text' },
							{ name: 'departing', label: 'Departing Player', type: 'text' },
						]}
					/>,
					<div key='result' className='modalResult'>
						<h3>
							Result <span>{this.state.progress}</span>
						</h3>
						<textarea value={this.state.result} readOnly />
					</div>,
				]}
			/>
		);
	}
}
