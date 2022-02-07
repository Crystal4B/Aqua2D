import React, {useEffect, useRef, useState} from 'react';
import {Level, ILevelProps} from './Level';
import './Editor.css';
import { setOptions } from '../../Redux/Menu/menuActions';
import { optionState } from '../../Redux/Menu/menuReducer';
import { addScene } from '../../Redux/Levels/levelsActions';
import { useDispatch, useSelector } from 'react-redux';
import { rootState } from '../../Redux/store';
import { levelState } from '../../Redux/Levels/levelReducer';
import { getLocalizedCoords } from '../../Helpers/TileHelper';

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
	const viewerRef = useRef<HTMLDivElement>(null);
	const [drag, setDrag] = useState(false);
	const [viewerSettings, setViewerSettings] = useState<viewerSettings>({xOffset: 0, yOffset: 0, scale: 1});
	
	const level = useSelector<rootState, levelState>(state => state.levels.levels[state.levels.selectedIndex]);

	const dispatch = useDispatch();

	// Prepare context menu
	const onAddScene = ({clientX, clientY}: React.MouseEvent) =>
	{
		const viewer = viewerRef.current;
		if (viewer !== null)
		{
			const [xCoord, yCoord] = getLocalizedCoords(viewer, clientX, clientY);
			dispatch(addScene("Level 1", "DEFAULT", xCoord, yCoord));
		}
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
		// calculate scale
		const scale = viewerSettings.scale + (deltaY < 0 ? 0.1 : -0.1);
		setViewerSettings({...viewerSettings, scale: scale});
	}

	const handleContextMenu = () =>
	{
		dispatch(setOptions(contextMenu));
	}

	return(
		<div
			ref={viewerRef}
			className={`viewport ${drag ? "drag" : ""}`}
			onWheel={handleWheel}
			onContextMenu={handleContextMenu}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseOut={handleMouseOut}>

			{level.scenes.map((scene, index) => {
				return <Level key={scene.sceneName} sceneIndex={index} xOffset={viewerSettings.xOffset} yOffset={viewerSettings.yOffset} scale={viewerSettings.scale} selected={scene.sceneSelected} />
			})}
		</div>
	);
}

export default LevelRenderer