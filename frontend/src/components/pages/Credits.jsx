import React from 'react';
import Modal from './Modal';
export default class Replacement extends React.Component {
	render() {
		return (
			<Modal
				title='Credits and Attributions'
				children={[
					<span>
						Uicons by <a href='https://www.flaticon.com/uicons'>Flaticon</a>
					</span>,
				]}
			/>
		);
	}
}
