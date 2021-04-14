import React from 'react';

export default class Template extends React.Component {
	constructor(props) {
		super(props);
		this.onChange = props.onChange;
	}
	render() {
		return (
			<div className='component modalForm'>
				<form onSubmit={(e) => e.preventDefault()}>
					<label htmlFor='template'>Role Template</label>
					<textarea name='template' onChange={this.onChange}></textarea>
					<input type='submit' value='Process Role Cards' />
				</form>
			</div>
		);
	}
}
