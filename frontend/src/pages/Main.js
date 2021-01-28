import React from 'react';
import logo from '../img/logo.png';
import '../css/reset.css';
import '../css/app.css';

function renderSubtitle(subtitle) {
    let subtitleCmpt = (<h2>{subtitle}</h2>);
    return subtitle ? subtitleCmpt : null;
}

export default function Main() {
    return (
        <div className='centerModal'>
            <img src={logo} alt='Logo' />
            <h1>Mafia Engine</h1>
            {renderSubtitle("Version Beta 1.1")}
            <br />
            <div>
                <a href='/rolecard'>Role Card</a>
                <a>Replacement Form</a>
                <a>Vote Counter</a>
                <a>Information</a>
            </div>
        </div>)
}
