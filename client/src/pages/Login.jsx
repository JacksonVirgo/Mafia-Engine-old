import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../res/logo.png';
import { DiscordLoginButton } from 'react-social-login-buttons';
import '../css/global.css';

import Cookies from 'universal-cookie';
import axios from 'axios';
const cookies = new Cookies();
axios.defaults.withCredentials = true;


const REDIRECT_URI = 'https://discord.com/api/oauth2/authorize?client_id=843514276383031296&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code&scope=identify%20guilds'
export default function Login(props) {
	const [hasLoggedIn, sethasLoggedIn] = useState(0);

	const [auth, setAuth] = useAuth();

	const location = useLocation();

	const requestLogin = async (code) => {
		const request = await axios.get(`http://localhost:3001/api/user/login?code=${code}`, { withCredentials: true });
		const response = await request.data;

		console.log(response);
	}

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const code = queryParams.get('code');


		sethasLoggedIn(code ? 2 : 1)

		if (!code) return;

		requestLogin(code);
	}, [])


	const onClick = (e) => {
		window.location.replace(REDIRECT_URI);
	};

	return (
		<div className='modalMain'>
			<img src={logo} alt='Logo' />
			<br />

			<p onClick={async () => {
				const res = await axios.get('http://localhost:3001/api/user/test', { withCredentials: true })
				console.log(res);
			}}>click me bitch</p>

			<div style={{ display: 'flex', justifyContent: 'center' }}>
				{hasLoggedIn == 1 && <DiscordLoginButton style={{ width: '275px' }} onClick={onClick} />}
			</div>
		</div>
	);
}
