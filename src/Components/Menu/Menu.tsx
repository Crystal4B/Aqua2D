import './Menu.css';
import useContextMenu from '../../Hooks/useContextMenu';
import { useSelector } from 'react-redux';
import { rootState } from '../../Redux/store';
import { menuState } from '../../Redux/Menu/menuReducer';

/**
 * Menu functional component responsible for the visuals of the ContextMenu
 */
const Menu = () => {
	const {xPos, yPos, showMenu} = useContextMenu();
	const options = useSelector<rootState, menuState["options"]>(state => state.menu.options);

	if (!showMenu)
	{
		return null;
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