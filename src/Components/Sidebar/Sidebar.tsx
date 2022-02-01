import './Sidebar.css';
import Resizer from './Resizer';
import React, { useState } from 'react';

interface iSidebarProps {
	left: boolean;
	children: JSX.Element;
}

const Sidebar = ({left, children}: iSidebarProps) => {
	const [width, setWidth] = useState(300);

	const resize = ({movementX}: React.MouseEvent) => {
		setWidth(width - movementX);
	}

	return(
		<>
			{left ? null : <Resizer func={resize}/> }
			<div className="sidebar" style={{width: `${width}px`}}>
				{children}
			</div>
			{left ? <Resizer func={resize}/> : null}
		</>
	);
}

export default Sidebar;