import React from 'react';
import logo from '../img/logo.png';
import '../css/reset.css';
import '../css/app.css';

function renderSubtitle(subtitle) {
    let subtitleCmpt = (<h2>{subtitle}</h2>);
    return subtitle ? subtitleCmpt : null;
}

export default function Main(auth) {
    return (
        <div className='centerModal'>
            <img src={logo} alt='Logo' />
            <h1>Mafia Engine</h1>
            {renderSubtitle("Version Beta 1.2")}
            <br />
            <div className='mainmenu'>
                <a className='menuoption' href='/rolecard'>Role Card</a>
                <a className='menuoption' href='/replacement'>Replacement Form</a>
                <a className='menuoption' href='/votecount'>Vote Counter</a>
                <a className='menuoption' href='/info'>Information</a>
            </div>
        </div>)
}
