import React from 'react';

export default function UnorderedList({ children, onChildClick }) {
	return (
		<ul>
			{children.map((v, i) => (
				<li key={i} onClick={onChildClick}>
					{v}
				</li>
			))}
		</ul>
	);
}
