import React, { setState } from 'react';
import { createSocket } from '../../scripts/websockets';
import Modal from './Modal';
import Form from '../forms/Form';
export default class Replacement extends React.Component {
	state = {
		result: '',
		progress: '',
	};
	socket = createSocket();
	onSubmit(e) {
		e.preventDefault();
	}
	render() {
		return (
			<Modal
				title='Replacement Form'
				children={[
					<Form key='replacementForm' onSubmit={this.onSubmit.bind(this)} submitText='Generate' children={[{ name: 'url', label: 'Game URL', type: 'text' }]} />,
					<div key='result'>
						<h3>
							Result <span>{this.state.progress}</span>
						</h3>
						<textarea className='modalResult' value={this.state.result} readOnly />
					</div>,
				]}
			/>
		);
	}
}
