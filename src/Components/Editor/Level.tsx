import React, { useEffect, useRef, useState } from "react";
import {getCoords} from "../../Helpers/TileHelper";

export interface ILevelProps
{
	x: number;
	y: number;
	selected: boolean;
}

interface ILevelSize
{
	width: number;
	height: number;
}

/**
 * Level class will contain details about the level being rendered by the renderer
 */
export const Level = ({x, y, selected}: ILevelProps) => {
	const squareSize = 32;

	// Initilise modes drawing modes
	const DRAWING = 1;
	const PREVIEW = 0;
	const ERASING = -1;

	// Initilise References for level
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const contextRef = useRef<CanvasRenderingContext2D | null>(null);
	const modeRef = useRef(PREVIEW);
	const layersRef = useRef<Number[][]>();
	const previewRef = useRef({x: -1, y: -1});

	// Initialise States for level
	const [size, setSize] = useState<ILevelSize>({width: 320, height: 320});

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas == null)
		{
			return;
		}
		
		const context = canvas.getContext("2d");
		contextRef.current = context;

		// Prepare level array
		layersRef.current = new Array(size.width);
		for (let i = 0; i < size.width; i++)
		{
			layersRef.current[i] = new Array(size.height);
			for (let j = 0; j < size.height; j++)
			{
				layersRef.current[i][j] = 0;
			}
		}

		const layers = layersRef.current;
		if (context != null)
		{
			// Draw level
			for (let i = 0; i < layers.length; i++)
			{
				for (let j = 0; j < layers[i].length; j++)
				{
					if (layers[i][j] === 0)
					{
						continue;
					}

					context.fillStyle = "white"; // REMOVE ME: For now drawn is white
					context.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
				}
			}
		}
	}, []);

	/**
	 * Renders a preview of the selected tile on the canvas
	 * @param x position of tile on the x-axis
	 * @param y position of tile on the y-axis
	 */
	const previewTile = (x: number, y: number) => {
		const context = contextRef.current;
		if (context != null)
		{
			// Remove tile in space
			context.clearRect(x * squareSize, y * squareSize, squareSize, squareSize);

			// Draw preview tile
			context.fillStyle = "black";
			context.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
		}
	}

	/**
	 * Adds a tile to the layers saved for the level
	 * @param x position of tile on the x-axis
	 * @param y position of tile on the y-axis
	 */
	const addTile = (x: number, y: number) => {
		const layers = layersRef.current;
		if (layers != null)
		{
			layers[x][y] = 1;
			restoreTile(x, y);
		}
	}

	/**
	 * Removes a tile from the layers saved for the level
	 * @param x position of tile on the x-axis
	 * @param y position of tile on the y-axis
	 */
	const removeTile = (x: number, y: number) => {
		const layers = layersRef.current;
		if (layers != null)
		{
			layers[x][y] = 0;
			restoreTile(x, y);
		}
	}

	/**
	 * Restores a tile to the canvas from the layers saved for the level
	 * @param x position of tile on the x-axis
	 * @param y position of tile on the y-axis
	 */
	const restoreTile = (x: number, y: number) => {
		const context = contextRef.current;
		const layers = layersRef.current;
		if (context != null && layers != null)
		{
			// Remove tile in space
			context.clearRect(x * squareSize, y * squareSize, squareSize, squareSize);

			if (layers[x][y] !== 0)
			{
				context.fillStyle = "white"; // REMOVE ME (For now drawn is white)
				context.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
			}
		}
	}

	/**
	 * Used to reset the drawing references for the level
	 */
	const resetDrawing = () => {
		modeRef.current = PREVIEW;
		previewRef.current.x = -1;
		previewRef.current.y = -1;
	}

	/**
	 * Handles mouse down events. For a level mouse downn means that the user is
	 * interacting with the level
	 */
	const handleMouseDown = (event: React.MouseEvent) => {
		if (!selected) {
			return;
		}

		event.stopPropagation();

		[x, y] = getCoords(event);

		switch(event.button)
		{
		case 0:
			modeRef.current = DRAWING;
			addTile(x, y);
			break;
		case 2:
			modeRef.current = ERASING;
			removeTile(x, y);
			break;
		}
	}

	/**
	 * Handles mouse up events. For a level mouse up means drawing is ending
	 */
	const handleMouseUp = (event: React.MouseEvent) => {
		modeRef.current = PREVIEW;
	}

	/**
	 * Handles mouse move events. For a level mouse move means drawing
	 * as well as previews of tiles
	 */
	const handleMouseMove = (event: React.MouseEvent) => {
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

		switch(modeRef.current)
		{
		case DRAWING:
			addTile(x, y);
			break;
		case ERASING:
			removeTile(x, y);
			break;
		case PREVIEW:
			// Update preview only when mouse enters a new square
			if (x !== previewRef.current.x || y !== previewRef.current.y)
			{
				// Restore tile if preview is already drawn on canvas
				if (previewRef.current.x !== -1 && previewRef.current.y !== -1)
				{
					restoreTile(previewRef.current.x, previewRef.current.y);
				}
	
				// Update preview position
				previewRef.current.x = x;
				previewRef.current.y = y;

				previewTile(x, y);
			}
		}
	}

	/**
	 * Handles mouse out events. for a level mouse out means that the
	 * preview square disappears and only the commited level is shown.
	 */
	const handleMouseOut = () => {
		if (!selected)
		{
			return;
		}

		restoreTile(previewRef.current.x, previewRef.current.y);
		resetDrawing();
	}

	/**
	 * Handles Context Menu event, causing it to not appear in drawing mode
	 */
	const handleContextMenu = (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
	}

	return (
		<canvas
			className={`level ${selected ? "selected" : ""}`}
			width={size.width}
			height={size.height}
			style={{left: x, top: y}}
			ref={canvasRef}

			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseMove={handleMouseMove}
			onMouseOut={handleMouseOut}
			onContextMenu={handleContextMenu}
		/>
	);
}

// Export the level class
export default Level;