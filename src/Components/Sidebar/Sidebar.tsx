import './Sidebar.css';
import Resizer from './Resizer';
import React, { useState } from 'react';
import { JsxEmit } from 'typescript';

interface iSidebarProps {
	left: boolean;
	children: JSX.Element | JSX.Element[];
}

const Sidebar = ({left, children}: iSidebarProps) => {
	const [width, setWidth] = useState(400);

	const resize = ({movementX}: React.MouseEvent) => {
		setWidth(width - movementX);
	}

	return(
		<>
			{left ? null : <Resizer orientation={"vertical"}/*func={resize}*//> }
			<div className="sidebar" style={{width: `${width}px`}}>
				{children}
			</div>
			{left ? <Resizer orientation={"vertical"}/*func={resize}*//> : null}
		</>
	);
}

export default Sidebar;