import React from 'react';
import Modal from './Modal';
export default class Replacement extends React.Component {
	render() {
		return <Modal title='Credits and Contact' children={[<span>If you need to contact me, you can find me on Discord at NashedPotato#2919 or on MafiaScum at JacksonVirgo.</span>, ,]} />;
	}
}
