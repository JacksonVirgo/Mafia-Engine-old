import React from 'react';

export default function Modal(p) {
	const { title, children } = p;
	return (
		<div className='modalMain'>
			<h1>{title}</h1>
			{children.map((c, i) => {
				return c;
			})}
		</div>
	);
}
