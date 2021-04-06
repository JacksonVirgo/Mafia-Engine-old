import React from 'react';
import logo from '../../img/logo.png';

export default function Main(auth) {
	return (
		<div className='modalMain'>
			<img src={logo} alt='Logo' />
			<h1>Error 404</h1>
			<h2>Page Not Found</h2>
		</div>
	);
}
