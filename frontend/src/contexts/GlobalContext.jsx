import axios from 'axios';
import React, { useState, createContext, useContext, useReducer } from 'react';
axios.defaults.withCredentials = true;

export const GlobalContext = createContext();
export const useGlobal = () => useContext(GlobalContext)

const reducer = (state) => {
    return state
}

const Global = ({ subPages }) => {
    const [reducer, setReducer] = useReducer(reducer, {
        msUsername: null,
        msAvatar: null,
        discordAvatar: null
    });

    return (
        <GlobalContext.Provider value={[reducer, setReducer]}>
            {subPages}
        </GlobalContext.Provider>
    )
}
export default Global;