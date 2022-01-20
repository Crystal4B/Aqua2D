import React from 'react';
import useContextMenu from '../../Hooks/useContextMenu';
import './Menu.css';

export interface MenuProps {
	names: Array<string>;
	functions: Array<(event: React.MouseEvent) => void>;
}

export const Menu = ({names, functions}: MenuProps) => {
	const {xPos, yPos, showMenu} = useContextMenu();

	if (!showMenu)
	{
		return null;
	}

	return(
		<div id='contextMenu' className='context-menu' style={{top: yPos, left: xPos}}>
			<ul className='menu'>
				{functions.map((_, index) => <li key={names[index]} className='button' onClick={functions[index]}>{names[index]}</li>)}
			</ul>
		</div>
	);
};