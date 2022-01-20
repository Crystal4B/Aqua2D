import {useEffect, useState} from "react";

const useContextMenu = () => {
	const [xPos, setXPos] = useState(0);
	const [yPos, setYPos] = useState(0);
	const [showMenu, setShowMenu] = useState(false);

	const handleContextMenu = (event: MouseEvent) => {
		event.preventDefault();

		const x = event.pageX + 100 < window.innerWidth ? event.pageX : window.innerWidth - 100;
		const y = event.pageY + 75 < window.innerHeight ? event.pageY : window.innerHeight - 80;

		setXPos(x);
		setYPos(y);
		setShowMenu(true);
	}

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