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

interface viewerSettings
{
	xOffset: number;
	yOffset: number;
	scale: number;
}

/**
 * Level Renderer is a componenet responsible for organizing and managing the level display
 */
const LevelRenderer = () =>
{
	const [drag, setDrag] = useState(false);
	const [viewerSettings, setViewerSettings] = useState<viewerSettings>({xOffset: 0, yOffset: 0, scale: 1});
	
	const [zoom, setZoom] = useState(1);
	const [levels, setLevels] = useState<ILevel>({last: 0, names: [], props: []});

	const dispatch = useDispatch();

	// Prepare context menu
	const onAddScene = ({clientX, clientY}: React.MouseEvent) => {
		dispatch(addScene("Level 1", "DEFAULT"));

		let newNames = [...levels.names, "scene 1"];
		let newLevel = [...levels.props, {xOffset: clientX, yOffset: clientY, scale: 1, selected: true}];

		setLevels({last: levels.last+1, names: newNames, props: newLevel});
	}
	const contextMenu: Array<optionState> = [
		{optionName: "Add Scene", optionFunction: onAddScene}
	];

	const handleMouseDown = (e: React.MouseEvent) =>
	{
		// 1 === Middle Click / Wheel Click
		if (e.button === 1)
		{
			e.preventDefault();
			setDrag(true);
		}
	}

	const handleMouseUp = () =>
	{
		setDrag(false);
		console.log(viewerSettings);
	}

	const handleMouseOut = () =>
	{
		setDrag(false);
	}

	const handleMouseMove = (e: React.MouseEvent) =>
	{
		if (drag)
		{
			setViewerSettings({...viewerSettings, xOffset: viewerSettings.xOffset + e.movementX, yOffset: viewerSettings.yOffset + e.movementY});
		}
	}

	function handleWheel({deltaY, clientX, clientY}: React.WheelEvent)
	{
		// if deltaY < 0 zoom in else zoom out
		setViewerSettings({...viewerSettings, scale: deltaY < 0 ? viewerSettings.scale + 0.1 : viewerSettings.scale - 0.1});
		console.log(viewerSettings);
	}

	function onAddLevel({clientX, clientY}: React.MouseEvent)
	{
		let name = `Scene_${levels.last+1}`;
		let newNames = [...levels.names];
		newNames.push(name);

		let newLevels = [...levels.props];
		newLevels.push({xOffset: clientX, yOffset: clientY, scale: 1, selected: false});

		setLevels({last: levels.last+1, names: newNames, props: newLevels});
	}

	const handleContextMenu = () =>
	{
		dispatch(setOptions(contextMenu));
	}

	return(
		<div className={`viewport ${drag ? "drag" : ""}`} onWheel={handleWheel} onContextMenu={handleContextMenu} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut} style={{zoom: zoom}}>
			{levels.props.map((level, index) => {
				return <Level key={levels.names[index]} xOffset={viewerSettings.xOffset} yOffset={viewerSettings.yOffset} scale={viewerSettings.scale} selected={level.selected
				} />
			})}
		</div>
	);
}

export default LevelRenderer