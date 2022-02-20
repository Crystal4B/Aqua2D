import React, {useEffect, useRef, useState} from 'react';
import {Level, ILevelProps} from './Level';
import './Editor.css';
import { setOptions } from '../../Redux/Menu/menuActions';
import { optionState } from '../../Redux/Menu/menuReducer';
import { addScene, moveScene } from '../../Redux/Levels/levelsActions';
import { useDispatch, useSelector } from 'react-redux';
import { rootState } from '../../Redux/store';
import { levelState, sceneState } from '../../Redux/Levels/levelReducer';
import { getLocalizedCoords } from '../../Helpers/TileHelper';

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
	
	const level = useSelector<rootState, levelState>(state => state.levels.levels[state.levels.selectedLevelId]);
	const scenes = useSelector<rootState, {[id: string]: sceneState}>(state => Object.fromEntries(Object.entries(state.levels.scenes).filter(([_, scene]) => scene.levelId === state.levels.selectedLevelId)))

	const dispatch = useDispatch();

	// Prepare context menu
	const onAddScene = ({clientX, clientY}: React.MouseEvent) =>
	{
		const viewer = viewerRef.current;
		if (viewer !== null)
		{
			const [xCoord, yCoord] = getLocalizedCoords(viewer, clientX, clientY);
			dispatch(addScene(level.id, "DEFAULT", xCoord, yCoord));
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

	const handleSceneMove = (sceneId: string, xPos: number, yPos: number) =>
	{
		const radius = 160;
		const tolerance = 20;

		for (let i = 0; i < Object.keys(scenes).length; i++)
		{
			const id = Object.keys(scenes)[i];

			if (id === sceneId)
			{
				continue;
			}

			const position = scenes[id].position;
			// Top
			if (position.yPos > yPos && yPos + radius > position.yPos - radius - tolerance && (position.xPos - radius - tolerance <= xPos && xPos <= position.xPos + radius + tolerance))
			{
				yPos = position.yPos - (radius * 2)
			}
			// Bottom
			else if (position.yPos < yPos && yPos - radius < position.yPos + radius + tolerance && (position.xPos - radius - tolerance <= xPos && xPos <= position.xPos + radius + tolerance))
			{
				yPos = position.yPos + (radius * 2)
			}
			// Left
			else if (position.xPos > xPos && xPos + radius >= position.xPos - radius - tolerance && (position.yPos - radius - tolerance <= yPos && yPos <= position.yPos + radius + tolerance))
			{
				xPos = position.xPos - (radius * 2)
			}
			// Right
			else if (position.xPos < xPos && xPos - radius <= position.xPos + radius + tolerance && position.yPos- radius - tolerance <= yPos && yPos <= position.yPos + radius + tolerance)
			{
				xPos = position.xPos + (radius * 2)
			}
		}

		dispatch(moveScene(sceneId, xPos, yPos));
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

			{Object.keys(scenes).map((sceneId) => {
				return <Level key={scenes[sceneId].sceneName} sceneId={sceneId} xOffset={viewerSettings.xOffset} yOffset={viewerSettings.yOffset} scale={viewerSettings.scale} selected={scenes[sceneId].selected} move={handleSceneMove}/>
			})}
		</div>
	);
}

export default LevelRenderer