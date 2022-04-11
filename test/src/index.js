import React from 'react';
import ReactDOM from 'react-dom';
import './css/global.css';
import { CookiesProvider } from "react-cookie";


import AuthContext from './contexts/AuthContext';

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
	Link
} from "react-router-dom";

import Login from './pages/Login';
import VoteCount from './pages/VoteCount'

function Pages() {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path='/mafiascum/votecount' element={<VoteCount />} />
				<Route
					path="*"
					element={<Navigate to="/login" replace />}
				/>
			</Routes>
		</Router>)
}

ReactDOM.render(
	<React.StrictMode>
		<CookiesProvider>
			<AuthContext subPages={<Pages />} />
		</CookiesProvider>
	</React.StrictMode>
	, document.getElementById('root')
);
