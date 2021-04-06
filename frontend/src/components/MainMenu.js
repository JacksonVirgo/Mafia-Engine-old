import React, { Component } from 'react';
import logo from '../img/logo.png';

export class MainMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			subtitle: 'Version Pre-Alpha 1.2',
		};
	}
	render() {
		return (
			<>
				<img src={logo} alt='Logo for MafiaEngine' />
				<h1>Mafia Engine</h1>
				<h2>{this.state.subtitle}</h2>
				<br />
				<div className='mainmenu'>
					<a className='menuoption' href='/rolecard'>
						Role Card
					</a>
					<a className='menuoption' href='/replacement'>
						Replacement Form
					</a>
					<a className='menuoption' href='/votecount'>
						Vote Counter
					</a>
					<a className='menuoption' href='/credits'>
						Credits and Attribution
					</a>
					{/* <a className="menuoption" href="/tools">
                        Alternative Links
                    </a>
                    <a className="menuoption" href="/info">
                        Information
                    </a> */}
				</div>
			</>
		);
	}
}
