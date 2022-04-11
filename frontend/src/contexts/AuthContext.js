import axios from 'axios';
import React, { useState, createContext, useContext } from 'react';
import { useCookies } from 'react-cookie';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
axios.defaults.withCredentials = true;

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext)

const AuthRoot = ({ subPages }) => {
    const [accessToken, setAccessToken] = useState('hello');
    const [cookies, setCookie] = useCookies(['accessToken']);

    return (
        <AuthContext.Provider value={[accessToken, (access) => {
            setAccessToken(access)
        }]}>
            {subPages}
        </AuthContext.Provider>
    )
}
export default AuthRoot;