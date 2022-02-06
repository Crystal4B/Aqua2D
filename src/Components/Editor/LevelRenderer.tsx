import React, {useState} from 'react';
import {Level, ILevelProps} from './Level';
import './Editor.css';
import { setOptions } from '../../Redux/Menu/menuActions';
import { optionState } from '../../Redux/Menu/menuReducer';
import { addScene } from '../../Redux/Levels/levelsActions';
import { useDispatch, useSelector } from 'react-redux';
import { rootState } from '../../Redux/store';
import { levelState } from '../../Redux/Levels/levelReducer';

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
	
	const level = useSelector<rootState, levelState>(state => state.levels.levels[state.levels.selectedIndex]);

	const dispatch = useDispatch();

	// Prepare context menu
	const onAddScene = ({clientX, clientY}: React.MouseEvent) =>
	{
		dispatch(addScene("Level 1", "DEFAULT"));
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

	const handleWheel = ({deltaY, clientX, clientY}: React.WheelEvent) =>
	{
		setViewerSettings({...viewerSettings, scale: deltaY < 0 ? viewerSettings.scale + 0.1 : viewerSettings.scale - 0.1});
	}

	const handleContextMenu = () =>
	{
		dispatch(setOptions(contextMenu));
	}

	return(
		<div className={`viewport ${drag ? "drag" : ""}`} onWheel={handleWheel} onContextMenu={handleContextMenu} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseOut={handleMouseOut}>
			{level.scenes.map((scene) => {
				return <Level key={scene.sceneName} xOffset={viewerSettings.xOffset} yOffset={viewerSettings.yOffset} scale={viewerSettings.scale} selected={scene.sceneSelected} />
			})}
		</div>
	);
}

export default LevelRenderer