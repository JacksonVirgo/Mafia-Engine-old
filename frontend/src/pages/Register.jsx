import React from 'react';
import logo from '../img/logo.png';

import { useGlobals } from '../GlobalProvider';

export default function Login(props) {
	const globalState = useGlobals();

	const registerAccount = async (e) => {
		e.preventDefault();
		const { loginUsername, loginPassword } = e.target;
		const body = { username: loginUsername.value, password: loginPassword.value };

		const response = await globalState.axios.post('api/auth/register', body);
		if (response.status === 201) {
			props.history.push('/login');
		}
	};

	return (
		<div className='modalMain'>
			<img src={logo} alt='Logo' />
			<h1>Register Form</h1>
			<br />
			<form onSubmit={registerAccount}>
				<div>
					<label htmlFor='loginUsername'>MafiaScum Username</label>
					<br />
					<input id='loginUsername' name='loginUsername' placeholder='Username' />
				</div>
				<div>
					<label htmlFor='loginPassword'>Password (not your MS password)</label>
					<br />
					<input id='loginPassword' name='loginPassword' type='password' />
				</div>
				<input type='submit' value='Register' />
			</form>
		</div>
	);
}
