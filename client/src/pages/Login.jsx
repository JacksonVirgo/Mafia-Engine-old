import React, { useState, useEffect } from 'react';
import logo from '../res/logo.png';
import { DiscordLoginButton } from 'react-social-login-buttons';

import '../css/global.css';

export default function Login(props) {
	const onClick = (e) => {
		window.location.replace('https://discord.com/oauth2/authorize?client_id=843514276383031296&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Flogin&response_type=code&scope=identify%20guilds%20guilds.members.read');
	};
	return (
		<div className='modalMain'>
			<img src={logo} alt='Logo' />
			<h1>Mafia Engine</h1>
			<br />

			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<DiscordLoginButton style={{ width: '275px' }} onClick={onClick} />
			</div>
			{/* <form>
				<div>
					<label htmlFor='loginUsername'>Username</label>
					<br />
					<input id='loginUsername' name='loginUsername' placeholder='Username' />
				</div>
				<div>
					<label htmlFor='loginPassword'>Password</label>
					<br />

					<input id='loginPassword' name='loginPassword' type='password' />
				</div>
				<input type='submit' value='Login' />
			</form> */}
		</div>
	);
}
