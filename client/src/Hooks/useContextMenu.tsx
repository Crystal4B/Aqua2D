import {useEffect, useState} from "react";

/**
 * useContextMenu is a custom hook for operating a ContextMenu in the application
 * @returns the current state of the context hook
 */
const useContextMenu = () =>
{
	const [xPos, setXPos] = useState(0);
	const [yPos, setYPos] = useState(0);
	const [showMenu, setShowMenu] = useState(false);

	/**
	 * handleContextMenu updates the state of the menu on event
	 * @param event a MouseEvent that trigged the menu
	 */
	const handleContextMenu = (event: MouseEvent) =>
	{
		event.preventDefault();

		const x = event.pageX + 100 < window.innerWidth ? event.pageX : window.innerWidth - 100;
		const y = event.pageY + 75 < window.innerHeight ? event.pageY : window.innerHeight - 80;

		setXPos(x);
		setYPos(y);
		setShowMenu(true);
	}

	/**
	 * handleClick removes a unwanted menu from the screen on click event
	 */
	const handleClick = () => {
		if (showMenu)
		{
			setShowMenu(false);
		}
	}

	useEffect(() => {
		// Set event listeners
		document.addEventListener('click', handleClick);
		document.addEventListener('contextmenu', handleContextMenu);
		return () => {
			// Clean up
			document.removeEventListener('click', handleClick);
			document.removeEventListener('contextmenu', handleContextMenu);
		};
	});

	return {xPos, yPos, showMenu};
}

export default useContextMenu;