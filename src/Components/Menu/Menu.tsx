import React from 'react';
import './Menu.css';

interface IItem
{
	name: string;
	function: {({clientX, clientY}: React.MouseEvent): void}
}

export interface IMenuProps
{
	x: number;
	y: number;
	items: IItem[];
};

export const Menu = ({x, y, items}: IMenuProps) => {
	return(
		<div id='contextMenu' className='context-menu' style={{top: y, left: x}}>
			<ul className='menu'>
				{items.map(item => {
					return <li className='button' onClick={item.function}>{item.name}</li>
				})}
			</ul>
		</div>
	);
};