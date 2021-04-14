import React from 'react';

export default class Input extends React.Component {
	constructor(props) {
		super(props);
		this.name = props.name;
		this.label = props.label;
		this.type = props.type;

		if (props.accept) this.accept = props.accept;
	}
	render() {
		return (
			<>
				<label htmlFor={this.name}>{this.label}</label>
				<input id={this.name} type={this.type} accept={this.accept || ''} />
			</>
		);
	}
}
