import React, {useState} from 'react';
import {Level, ILevelProps} from './Level';
import './Editor.css';
import { setOptions } from '../../Redux/Menu/menuActions';
import { optionState } from '../../Redux/Menu/menuReducer';
import { addScene } from '../../Redux/Levels/levelsActions';
import { useDispatch } from 'react-redux';

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

	const dispatch = useDispatch();

	// Prepare context menu
	const onAddScene = ({clientX, clientY}: React.MouseEvent) => {
		dispatch(addScene("Level 1", "DEFAULT"));

		let newNames = [...levels.names, "scene 1"];
		let newLevel = [...levels.props, {x: clientX, y: clientY, selected: true}];

		setLevels({last: levels.last+1, names: newNames, props: newLevel});
	}
	const contextMenu: Array<optionState> = [
		{optionName: "Add Scene", optionFunction: onAddScene}
	];

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

	const handleContextMenu = () =>
	{
		dispatch(setOptions(contextMenu));
	}

	return(
		<div className='viewport' onWheel={handleWheel} onContextMenu={handleContextMenu} style={{zoom: zoom}}>
			{levels.props.map((level, index) => {
				return <Level key={levels.names[index]} x={level.x} y={level.y} selected={level.selected
				} />
			})}
		</div>
	);
}

export default LevelRenderer