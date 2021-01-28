import React from 'react';
import logo from '../img/logo.png';
import '../css/reset.css';
import '../css/app.css';

export default function NotFoundPage() {
    return (
        <div className='centerModal'>
            <img src={logo} alt='Logo' />
            <h1>404</h1>
            <h2>Page Not Found</h2>
        </div>)
}
