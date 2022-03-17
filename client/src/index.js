import React from 'react';
import ReactDOM from 'react-dom';
// import { DiscordLoginButton } from 'react-social-login-buttons';
import Login from './pages/Login';

import './css/global.css';

ReactDOM.render(
	<React.StrictMode>
		<Login />
	</React.StrictMode>,
	document.getElementById('root')
);
