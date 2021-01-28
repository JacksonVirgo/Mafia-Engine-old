import React from 'react';
import logo from '../img/logo.png';

function renderLogo(showLogo) {
    let logoCmpt = (<img src={logo} alt='Logo' />);
    return showLogo ? logoCmpt : null;
}
function renderSubtitle(subtitle) {
    let subtitleCmpt = (<h2>{subtitle}</h2>);
    return subtitle ? subtitleCmpt : null;
}

export default function Titlescreen({ showIcon, title, subtitle }) {
    return (
        <div className='centerModal'>
            {renderLogo(showIcon)}
            <h1>{title}</h1>
            {renderSubtitle(subtitle)}
        </div>
    )
}
