import React from 'react';
import Form from '../../forms/Form.jsx';
import Field from '../../forms/Field';
import Input from '../../forms/Input';

export default class Import extends React.Component {
	constructor(props) {
		super(props);
		this.formSubmit = props?.formSubmit;
	}
	render() {
		return <Form onSubmit={this.formSubmit.bind(this)} submitText='Import' children={[<Field key='file' child={<Input name='file' label='Upload CSV' type='file' />} />]} />;
	}
}
