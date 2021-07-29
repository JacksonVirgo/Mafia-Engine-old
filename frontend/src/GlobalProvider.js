import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { io } from 'socket.io-client';

axios.defaults.baseURL = 'http://localhost:5000/';
const cookies = new Cookies();

export const ACTIONS = {
    SET_JWT: 'set_jwt',
    CHANGE_SOCKET_LISTENER: 'change_socket_listener',
};
function globalReducer(state, action) {
    const { type, payload } = action;
    const { jwt, socketListeners } = payload;
    switch (type) {
        case ACTIONS.SET_JWT:
            setAuthToken(jwt);
            return { ...state, jwt };
        case ACTIONS.CHANGE_SOCKET_LISTENER:
            const skt = manageSocketListeners(state.socket, socketListeners);
            return { ...state, socket: skt };
        default:
            return state;
    }
}

function manageSocketListeners(socket, payload) {
    for (const cmd of payload) {
        const { tag, func } = cmd;
        if (!tag) continue;
        if (func)
            socket.on(tag, (data) => {
                func(data);
            });
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

const handleSocketConnection = () => io();

export const GlobalContext = React.createContext();
export const GlobalUpdateContext = React.createContext();
export const useGlobals = () => useContext(GlobalContext);
export const useGlobalsUpdate = () => useContext(GlobalUpdateContext);

export default function GlobalProvider({ children }) {
    const jwt = handleAuthToken();
    const socket = handleSocketConnection();
    const [state, dispatch] = useReducer(globalReducer, { jwt, axios, socket });
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
