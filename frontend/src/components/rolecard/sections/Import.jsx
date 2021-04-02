import React from 'react';
import Form from '../../forms/Form.jsx';

export default class extends React.Component {
	constructor(props) {
		super(props);
		this.formSubmit = props?.formSubmit;
	}
	render() {
		return (
			<Form
				onSubmit={this.formSubmit.bind(this)}
				submitText='Import'
				children={[
					{ name: 'file', label: 'Upload CSV', type: 'file' },
					{ name: 'clear', label: 'Clear Current Role Data', type: 'checkbox' },
				]}
			/>
		);
	}
}
