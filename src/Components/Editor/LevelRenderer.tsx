import {useState} from 'react';
import Level from './Level';
import './Editor.css';

const LEVELS = [Level, Level]

/**
 * Level Renderer is a componenet responsible for organizing and managing the level display
 */
const LevelRenderer = () =>
{
	const [zoom, setZoom] = useState(1)

	function handleWheel({deltaY, clientX, clientY}: React.WheelEvent)
	{
		// if deltaY < 0 zoom in else zoom out
		setZoom(deltaY < 0 ? zoom + 0.1 : zoom - 0.1);
	}

	return(
		<div className='viewport' onWheel={handleWheel} style={{zoom: zoom}}>
			{LEVELS.map((Level, index) => {
				return Level({key: index, scale: 1})
			})}
		</div>
	);
}

export default LevelRenderer