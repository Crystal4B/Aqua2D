import {useState} from 'react';
import {Level, ILevelProps} from './Level';
import {Menu, MenuProps} from '../Menu/Menu';
import './Editor.css';

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
	const [levels, setLevels] = useState<ILevel>({last: 0, props: []});

	function handleWheel({deltaY, clientX, clientY}: React.WheelEvent)
	{
		// if deltaY < 0 zoom in else zoom out
		setZoom(deltaY < 0 ? zoom + 0.1 : zoom - 0.1);
	}

	function onAddLevel({clientX, clientY}: React.MouseEvent)
	{
		let name = `Scene_${levels.last+1}`;
		let newLevels = [...levels.props];
		newLevels.push({key: name, x: clientX, y: clientY});

		setLevels({last: levels.last+1, props: newLevels});
	}

	return(
		<div className='viewport' onWheel={handleWheel} style={{zoom: zoom}}>
			{levels.props.map((level) => {
				return <Level key={level.key} x={level.x} y={level.y} />
			})}
			<Menu names={["Add Level"]} functions={[onAddLevel]}/>
		</div>
	);
}

export default LevelRenderer