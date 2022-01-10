import React, {useEffect, useState} from 'react';
import Level from './Level';
import Menu from '../Menu/Menu';
import './Editor.css';

const LEVELS = [Level, Level]

interface IContextItem
{
	name: string;
	function: {(): void}
}

interface IContextMenu
{
	active: boolean;
	x: number;
	y: number;
	items: IContextItem[];
}

/**
 * Level Renderer is a componenet responsible for organizing and managing the level display
 */
const LevelRenderer = () =>
{
	const [zoom, setZoom] = useState(1);
	const [contextMenu, setActiveContext] = useState<IContextMenu>({active: false, x: 0, y: 0, items:[]});

	function handleWheel({deltaY, clientX, clientY}: React.WheelEvent)
	{
		// if deltaY < 0 zoom in else zoom out
		setZoom(deltaY < 0 ? zoom + 0.1 : zoom - 0.1);
	}

	function handleOnContextMenu(e: React.MouseEvent): void
	{
		e.preventDefault();
		
		console.log(e);
		if (!contextMenu.active)
		{
			setActiveContext({active: true, x: e.clientX, y: e.clientY, items: [{name: 'Add Level', function: onAddLevel}]});
		}
		else if (e.clientX != contextMenu.x || e.clientY != contextMenu.y)
		{
			setActiveContext({...contextMenu, x: e.clientX, y: e.clientY});
		}
		else
		{
			setActiveContext({...contextMenu, active: false});
		}
	}

	function onAddLevel()
	{
		console.log("adding item");
	}

	function onDeleteLevel()
	{
		console.log("deleting button")
	}

	function getContextMenu()
	{
		if (contextMenu.active)
		{
			return <Menu x={contextMenu.x} y={contextMenu.y} items={contextMenu.items}/>
		}
	}

	return(
		<div className='viewport' onContextMenu={handleOnContextMenu} onWheel={handleWheel} style={{zoom: zoom}}>
			{LEVELS.map((Level, index) => {
				return Level({key: index, scale: 1})
			})}
			{getContextMenu()}
		</div>
	);
}

export default LevelRenderer