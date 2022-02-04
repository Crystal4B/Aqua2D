import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLevel } from '../../Redux/Levels/levelsActions'
import useContextMenu from '../../Hooks/useContextMenu';
import './Menu.css';
import { rootState } from '../../Redux/store';
import { menuState } from '../../Redux/Menu/menuReducer';

const Menu = () => {
	const {xPos, yPos, showMenu} = useContextMenu();
	const options = useSelector<rootState, menuState["options"]>(state => state.menu.options);

	const dispatch = useDispatch();

	if (!showMenu)
	{
		return null;
	}

	const handleonClick = () => {
		dispatch(addLevel("Level 4"));
	}

	return(
		<div id='contextMenu' className='context-menu' style={{top: yPos, left: xPos}}>
			<ul className='menu'>
				{options.map((option) => <li key={option.optionName} className='button' onClick={option.optionFunction}>{option.optionName}</li>)}
			</ul>
		</div>
	);
};

export default Menu;