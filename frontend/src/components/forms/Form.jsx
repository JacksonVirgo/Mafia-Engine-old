import React from 'react';
import Field from './Field.jsx';
import Input from './Input';
export default class Form extends React.Component {
	constructor(props) {
		super(props);
		this.onSubmit = props.onSubmit;
		this.children = props.children;
		this.submitText = props.submitText;
	}
	render() {
		return (
			<form className='modalForm' onSubmit={this.onSubmit}>
				{this.children.map((c, i) => {
					return <Field key={c.name} child={<Input name={c.name} label={c.label} type={c.type} />} />;
				})}
				<input type='submit' value={this.submitText} />
			</form>
		);
	}
}
