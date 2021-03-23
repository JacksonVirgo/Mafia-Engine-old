import React from 'react';

export default (props) => {
	const { onSubmit, submitText, children } = props;
	return (
		<form onSubmit={onSubmit}>
			{children.map((component, index) => {
				<div>{component}</div>;
			})}
			<input type='submit'>{submitText}</input>
		</form>
	);
};
