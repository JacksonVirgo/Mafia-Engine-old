import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
axios.defaults.baseURL = 'http://localhost:5000/';
const cookies = new Cookies();

export const ACTIONS = {
	SET_JWT: 'set_jwt',
};
function globalReducer(state, action) {
	const { type, payload } = action;
	const { jwt } = payload;
	switch (type) {
		case ACTIONS.SET_JWT:
			setAuthToken(jwt);
			return { ...state, jwt };
		default:
			return state;
	}
}

function setAuthToken(token) {
	cookies.set('auth-token', token);
	handleAuthToken(token);
}

function handleAuthToken(token = null) {
	const authToken = token || cookies.get('auth-token');
	if (authToken) axios.defaults.headers.common['auth-token'] = authToken;
	return authToken || null;
}

export const GlobalContext = React.createContext();
export const GlobalUpdateContext = React.createContext();
export const useGlobals = () => useContext(GlobalContext);
export const useGlobalsUpdate = () => useContext(GlobalUpdateContext);

export default function GlobalProvider({ children }) {
	const jwt = handleAuthToken();
	const [state, dispatch] = useReducer(globalReducer, { jwt, axios });
	useEffect(() => console.log('Global State Updated'), [state]);

	return (
		<GlobalContext.Provider value={state}>
			<GlobalUpdateContext.Provider value={dispatch}>
				{''}
				{children}
			</GlobalUpdateContext.Provider>
		</GlobalContext.Provider>
	);
}
