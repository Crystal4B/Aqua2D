import {useState} from 'react';
import {Level, ILevelProps} from './Level';
import {Menu, MenuProps} from '../Menu/Menu';
import './Editor.css';

interface ILevel
{
	last: number;
	names: string[];
	props: ILevelProps[];
}

/**
 * Level Renderer is a componenet responsible for organizing and managing the level display
 */
const LevelRenderer = () =>
{
	const [zoom, setZoom] = useState(1);
	const [levels, setLevels] = useState<ILevel>({last: 0, names: [], props: []});

	function handleWheel({deltaY, clientX, clientY}: React.WheelEvent)
	{
		// if deltaY < 0 zoom in else zoom out
		setZoom(deltaY < 0 ? zoom + 0.1 : zoom - 0.1);
	}

	function onAddLevel({clientX, clientY}: React.MouseEvent)
	{
		let name = `Scene_${levels.last+1}`;
		let newNames = [...levels.names];
		newNames.push(name);

		let newLevels = [...levels.props];
		newLevels.push({x: clientX, y: clientY, selected: false});

		setLevels({last: levels.last+1, names: newNames, props: newLevels});
	}

	return(
		<div className='viewport' onWheel={handleWheel} style={{zoom: zoom}}>
			{levels.props.map((level, index) => {
				return <Level key={levels.names[index]} x={level.x} y={level.y} selected={level.selected
				} />
			})}
			<Menu names={["Add Level"]} functions={[onAddLevel]}/>
		</div>
	);
}

export default LevelRenderer