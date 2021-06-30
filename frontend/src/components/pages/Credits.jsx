import React from 'react';
import Modal from './Modal';
export default class Replacement extends React.Component {
	render() {
		return (
			<Modal
				title='Credits and Contact'
				children={[
					<span>If you need to contact me, you can find me on Discord at NashedPotato#2919 or on MafiaScum at JacksonVirgo.</span>,
					<div>
						Icons made by{' '}
						<a href='https://www.freepik.com' title='Freepik'>
							Freepik
						</a>{' '}
						from{' '}
						<a href='https://www.flaticon.com/' title='Flaticon'>
							www.flaticon.com
						</a>
					</div>,
				]}
			/>
		);
	}
}
