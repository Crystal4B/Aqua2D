import {useState} from 'react';
import {Level, ILevelProps} from './Level';
import {Menu, IMenuProps} from '../Menu/Menu';
import './Editor.css';

interface IContextMenu
{
	active: boolean;
	props: IMenuProps;
}

interface ILevel
{
	last: number;
	props: ILevelProps[];
}

/**
 * Level Renderer is a componenet responsible for organizing and managing the level display
 */
const LevelRenderer = () =>
{
	const [zoom, setZoom] = useState(1);
	const [contextMenu, setActiveContext] = useState<IContextMenu>({active: false, props: {x: 0, y: 0, items:[]}});
	const [levels, setLevels] = useState<ILevel>({last: 0, props: []});

	function handleWheel({deltaY, clientX, clientY}: React.WheelEvent)
	{
		// if deltaY < 0 zoom in else zoom out
		setZoom(deltaY < 0 ? zoom + 0.1 : zoom - 0.1);
	}

	function handleOnContextMenu(e: React.MouseEvent): void
	{
		e.preventDefault();
		
		if (!contextMenu.active)
		{
			setActiveContext({active: true, props: {x: e.clientX, y: e.clientY, items: [{name: 'Add Level', function: onAddLevel}]}});
		}
		else if (e.clientX !== contextMenu.props.x || e.clientY !== contextMenu.props.y)
		{
			setActiveContext({...contextMenu, props: {...contextMenu.props, x: e.clientX, y: e.clientY}});
		}
		else
		{
			setActiveContext({...contextMenu, active: false});
		}
	}

	function onAddLevel({clientX, clientY}: React.MouseEvent)
	{
		let name = `Scene_${levels.last+1}`;
		let newLevels = [...levels.props];
		newLevels.push({key: name, x: clientX, y: clientY});


		setLevels({last: levels.last+1, props: newLevels});
	}

	function getContextMenu()
	{
		if (contextMenu.active)
		{
			return <Menu {...contextMenu.props}/>
		}
	}

	return(
		<div className='viewport' onContextMenu={handleOnContextMenu} onWheel={handleWheel} style={{zoom: zoom}}>
			{levels.props.map((level) => {
				return <Level key={level.key} x={level.x} y={level.y} />
			})}
			{getContextMenu()}
		</div>
	);
}

export default LevelRenderer