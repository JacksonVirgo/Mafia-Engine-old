import React from 'react';
import logo from '../img/logo.png';
import '../css/reset.css';
import '../css/app.css';

import ReplacementForm from '../components/ReplacementForm';
export default function Replacement() {
    return (
        <div className='centerModal'>
            <h1>Replacement Form</h1>
            <br />
            <ReplacementForm />
        </div>)
}
