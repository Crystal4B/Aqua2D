import './Editor.css';
import {useRef, useState} from 'react';
import {Level} from './Level';
import { setOptions } from '../../Redux/Menu/menuActions';
import { optionState } from '../../Redux/Menu/menuReducer';
import { useDispatch, useSelector } from 'react-redux';
import { rootState } from '../../Redux/store';
import { levelsState } from '../../Redux/Levels/Levels/levelReducer';
import { getLocalizedCoords } from '../../Helpers/TileHelper';
import { addScene, connectScene, moveScene } from '../../Redux/Levels/Scenes/sceneActions';
import { sceneState } from '../../Redux/Levels/Scenes/sceneReducer';

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

	
	const levelId = useSelector<rootState, levelsState["selectedId"]>(state => state.levels.levels.selectedId);
	const {data, selectedId} = useSelector<rootState, {data: {[layerId: string]: sceneState}, selectedId: string}>(state => state.levels.scenes.byId[levelId]);

	const dispatch = useDispatch();

	// Prepare context menu
	const onAddScene = ({clientX, clientY}: React.MouseEvent) =>
	{
		const viewer = viewerRef.current;
		if (viewer !== null)
		{
			var numberOfScenes = Object.keys(data).length;
			var name = `Scene ${numberOfScenes+1}`;

			const [xCoord, yCoord] = getLocalizedCoords(viewer, clientX, clientY);
			dispatch(addScene(levelId, name, xCoord, yCoord));
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
		const tolerance = 40;
		var connection: {
			dir: "up" | "down" | "left" | "right",
			sceneId: string
		} = {
			dir: "up",
			sceneId: ""
		}

		for (let i = 0; i < Object.keys(data).length; i++)
		{
			const id = Object.keys(data)[i];
			
			if (id === sceneId)
			{
				continue;
			}

			const position = data[id].position;
			// Top
			if (position.yPos > yPos && yPos + radius > position.yPos - radius - tolerance && (position.xPos - radius - tolerance <= xPos && xPos <= position.xPos + radius + tolerance))
			{
				xPos = position.xPos
				yPos = position.yPos - (radius * 2)
				connection.dir = 'up';
				connection.sceneId = id;
				break;
			}
			// Bottom
			else if (position.yPos < yPos && yPos - radius < position.yPos + radius + tolerance && (position.xPos - radius - tolerance <= xPos && xPos <= position.xPos + radius + tolerance))
			{
				xPos = position.xPos
				yPos = position.yPos + (radius * 2)
				connection.dir = 'down';
				connection.sceneId = id;
				break;
			}
			// Left
			else if (position.xPos > xPos && xPos + radius >= position.xPos - radius - tolerance && (position.yPos - radius - tolerance <= yPos && yPos <= position.yPos + radius + tolerance))
			{
				xPos = position.xPos - (radius * 2)
				yPos = position.yPos
				connection.dir = 'left';
				connection.sceneId = id;
				break;
			}
			// Right
			else if (position.xPos < xPos && xPos - radius <= position.xPos + radius + tolerance && position.yPos- radius - tolerance <= yPos && yPos <= position.yPos + radius + tolerance)
			{
				xPos = position.xPos + (radius * 2)
				yPos = position.yPos
				connection.dir = 'right';
				connection.sceneId = id;
				break;
			}
		}

		if (connection.sceneId !== "")
			dispatch(connectScene(levelId, sceneId, connection));

		dispatch(moveScene(levelId, sceneId, xPos, yPos));
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

			{Object.keys(data).map((sceneId) => {
				return <Level key={data[sceneId].sceneName} levelId={levelId} sceneId={sceneId} xOffset={viewerSettings.xOffset} yOffset={viewerSettings.yOffset} scale={viewerSettings.scale} selected={sceneId === selectedId} move={handleSceneMove}/>
			})}
		</div>
	);
}

export default LevelRenderer