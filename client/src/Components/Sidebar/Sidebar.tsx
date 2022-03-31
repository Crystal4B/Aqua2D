import './Sidebar.css';
import Resizer from './Resizer';
import { useState } from 'react';

/**
 * sidebarProps represent the probs that the sidebar requires to operate
 */
interface sidebarProps {
	left: boolean;
	children: JSX.Element | JSX.Element[];
}

/**
 * Sidebar is a compositional component that manages UI Panels
 * @param sidebarProps the required props for the toolbar
 * @returns JSX code for the sidebar
 */
const Sidebar = ({left, children}: sidebarProps) => {
	const [width, setWidth] = useState(400);

	/**
	 * resize function for resizing the sidebar
	 * @param movementX the amount of movement on the x-axis caused by the user
	 */
	const resize = ({movementX}: React.MouseEvent) => {
		setWidth(width - movementX);
	}

	return(
		<>
			{left ? null : <Resizer orientation={"vertical"}/> }
			<div className="sidebar" style={{width: `${width}px`}}>
				{children}
			</div>
			{left ? <Resizer orientation={"vertical"}/> : null}
		</>
	);
}

export default Sidebar;