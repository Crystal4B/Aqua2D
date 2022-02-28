import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getCoords} from "../../Helpers/TileHelper";
import { sceneState } from "../../Redux/Levels/levelReducer";
import {selectScene} from "../../Redux/Levels/levelsActions";
import {rootState} from "../../Redux/store";
import {tileState, toolState} from "../../Redux/Tools/toolReducer";

export interface ILevelProps
{
	sceneId: string;
	xOffset: number;
	yOffset: number;
	scale: number;
	selected: boolean;
	move: (sceneId: string, xPos: number, yPos: number) => void;
}

interface ILevelSize
{
	width: number;
	height: number;
}

/**
 * Level class will contain details about the level being rendered by the renderer
 */
export const Level = ({sceneId, xOffset, yOffset, scale, selected, move}: ILevelProps) =>
{
	const squareSize = 32;

	const toolbarSettings = useSelector<rootState, toolState>(state => state.toolbar);
	const sceneData = useSelector<rootState, sceneState>(state => state.levels.scenes[sceneId]);
	const dispatch = useDispatch();

	const [drag, setDrag] = useState(false);
	const dragRef = useRef({x: 0, y: 0});

	// Load image
	const image = new Image();
	if (toolbarSettings.tileset)
	{
		image.src = toolbarSettings.tileset;
	}

	// Initilise References for level
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const contextRef = useRef<CanvasRenderingContext2D | null>(null);
	const mouseDownRef = useRef(false);
	const layersRef = useRef<tileState[][]>(Array(320).fill(0).map(row => new Array(320).fill({xCoord: -1, yCoord: -1, rotation: 0})));
	const previewRef = useRef({x: -1, y: -1});

	// Initialise States for level
	const [size, setSize] = useState<ILevelSize>({width: 320, height: 320});

	useEffect(() =>
	{
		const canvas = canvasRef.current;
		if (canvas == null)
		{
			return;
		}
		
		const context = canvas.getContext("2d");
		contextRef.current = context;

		const layers = layersRef.current;
		if (context != null)
		{
			// Draw level
			for (let i = 0; i < layers.length; i++)
			{
				for (let j = 0; j < layers[i].length; j++)
				{
					if (layers[i][j].xCoord === -1 || layers[i][j].yCoord === -1)
					{
						continue;
					}

					draw(layers[i][j], i, j);
				}
			}
		}
	}, []);

	/**
	 * Renders a preview of the selected tile on the canvas
	 * @param x position of tile on the x-axis
	 * @param y position of tile on the y-axis
	 */
	const previewTile = (x: number, y: number) =>
	{
		previewRef.current.x = x;
		previewRef.current.y = y;

		const context = contextRef.current;
		if (context != null)
		{
			// Remove tile in space
			context.clearRect(x * squareSize, y * squareSize, squareSize, squareSize);

			// Draw preview tile
			draw(toolbarSettings.tile, x, y);
		}
	}

	/**
	 * Adds a tile to the layers saved for the level
	 * @param x position of tile on the x-axis
	 * @param y position of tile on the y-axis
	 */
	const addTile = (x: number, y: number) =>
	{
		layersRef.current[x][y] = {...toolbarSettings.tile};
		restoreTile(x, y);

	}

	/**
	 * Removes a tile from the layers saved for the level
	 * @param x position of tile on the x-axis
	 * @param y position of tile on the y-axis
	 */
	const removeTile = (x: number, y: number) =>
	{
		layersRef.current[x][y] = {xCoord: -1, yCoord: -1, rotation: 0};
		restoreTile(x, y);
	}

	/**
	 * Restores a tile to the canvas from the layers saved for the level
	 * @param x position of tile on the x-axis
	 * @param y position of tile on the y-axis
	 */
	const restoreTile = (x: number, y: number) =>
	{
		if (x === -1 || y === -1)
		{
			return;
		}

		const context = contextRef.current;
		if (context != null)
		{
			// replace tile
			context.clearRect(x * squareSize, y * squareSize, squareSize, squareSize);
			draw(layersRef.current[x][y], x, y);
		}
	}

	/**
	 * draw completes a drawing of a single tile on the canvas
	 * @param tile Tile being drawn onto the screen
	 * @param x the x position in tileset coordinates
	 * @param y the y position in tileset coordinates
	 */
	const draw = (tile: tileState, x: number, y: number) =>
	{
		if (tile.xCoord === -1 || tile.yCoord === -1)
		{
			return;
		}

		const context = canvasRef.current?.getContext("2d");
		if (context)
		{
			if (tile.rotation % 360 !== 0 && tile.rotation !== 0)
			{
				const TO_RADIANS = Math.PI/180;
				const cx = x * squareSize + squareSize / 2;
				const cy = y * squareSize +  squareSize / 2;

				context.save();
				context.translate(cx, cy);
				context.rotate(tile.rotation * TO_RADIANS);
				context.translate(-cx, -cy);
			}
			context.drawImage(image, tile.xCoord * squareSize, tile.yCoord * squareSize, squareSize, squareSize, x * squareSize, y * squareSize, squareSize, squareSize);
			if (tile.rotation % 360 !== 0 || tile.rotation !== 0)
			{
				context.restore();
			}
		}
	}

	/**
	 * Used to reset the drawing references for the level
	 */
	const resetDrawing = (hard: boolean = false) =>
	{
		mouseDownRef.current = false;
		setDrag(false);
		
		if (hard)
		{
			previewRef.current.x = -1;
			previewRef.current.y = -1;
		}
	}

	/**
	 * Handles mouse down events. For a level mouse downn means that the user is
	 * interacting with the level
	 */
	const handleMouseDown = (event: React.MouseEvent) =>
	{
		if (!sceneData.selected)
		{
			dispatch(selectScene(sceneData.id));
		}

		if (event.button === 0 || event.button === 2)
		{
			mouseDownRef.current = true;
		}

		const [x, y] = getCoords(event);
		switch(event.button)
		{
		case 0:
			if (toolbarSettings.tool === "Draw")
			{
				addTile(x, y);
			}
			else if (toolbarSettings.tool === "Move")
			{
				setDrag(true);
				dragRef.current = {x: event.clientX, y: event.clientY};
			}
			break;
		case 2:
			if (toolbarSettings.tool === "Erase")
			{
				removeTile(x, y);
			}
			break;
		}
	}

	/**
	 * Handles mouse up events. For a level mouse up means drawing is ending
	 */
	const handleMouseUp = (event: React.MouseEvent) =>
	{
		resetDrawing();
	}

	/**
	 * Handles mouse move events. For a level mouse move means drawing
	 * as well as previews of tiles
	 */
	const handleMouseMove = (event: React.MouseEvent) =>
	{
		if (!selected)
		{
			return;
		}

		const canvas = canvasRef.current;
		const context = contextRef.current;
		const [x, y] = getCoords(event);
		if (canvas == null || context == null)
		{
			return;
		}

		switch(toolbarSettings.tool)
		{
		case "Move":
			if (mouseDownRef.current)
			{
				const {x, y} = dragRef.current;
				const mouseX = event.clientX - x;
				const mouseY = event.clientY - y;
				dragRef.current = {x: event.clientX, y: event.clientY}

				move(sceneId, sceneData.position.xPos + mouseX, sceneData.position.yPos + mouseY);
			}
			break;
		case "Draw":
			if (mouseDownRef.current)
			{
				addTile(x, y);
			}
			else
			{
				// Update preview only when mouse enters a new square
				if (x !== previewRef.current.x || y !== previewRef.current.y)
				{
					// Restore tile if preview is already drawn on canvas
					restoreTile(previewRef.current.x, previewRef.current.y);

					// Update preview
					previewTile(x, y);
				}
			}
			break;
		case "Erase":
			if (mouseDownRef.current)
			{
				removeTile(x, y);
			}
		}
	}

	/**
	 * Handles mouse out events. for a level mouse out means that the
	 * preview square disappears and only the commited level is shown.
	 */
	const handleMouseOut = () =>
	{
		if (!selected)
		{
			return;
		}

		restoreTile(previewRef.current.x, previewRef.current.y);
		resetDrawing(true);
	}

	/**
	 * Handles Context Menu event, causing it to not appear in drawing mode
	 */
	const handleContextMenu = (event: React.MouseEvent) =>
	{
		event.preventDefault();
		event.stopPropagation();
	}

	return (
		<canvas
			className={`level ${selected ? "selected" : ""}`}
			width={size.width}
			height={size.height}
			style={{
				left: `${(sceneData.position.xPos + xOffset)}px`,
				top: `${(sceneData.position.yPos + yOffset)}px`,
				width: `${size.width * scale}px`,
				height: `${size.height * scale}px`
			}}
			ref={canvasRef}

			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseMove={handleMouseMove}
			onMouseOut={handleMouseOut}
			onContextMenu={handleContextMenu}
		/>
	);
}

export default Level;