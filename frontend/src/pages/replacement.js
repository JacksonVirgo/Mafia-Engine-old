import React from 'react';
import logo from '../img/logo.png';
import '../css/reset.css';
import '../css/app.css';

import ReplacementForm from '../components/ReplacementForm';

async function onSubmit(e) {
    e.preventDefault();
    const serial = e.target.serialize();
    console.log(serial);

    console.log(e.target);
    let gameThread = e.target.gameThread;
    let departingPlayer = e.target.departingPlayer;

    const response = await fetch('http://localhost:5000/api/replacement/' + encodeURIComponent(gameThread));
    const json = await response.json();
}

export default function Replacement() {
    return (
        <div className='centerModal'>
            <h1>Replacement Form</h1>
            <br />
            <ReplacementForm />
        </div>)
}
