import React, { useEffect, useRef, useState } from "react";

export interface ILevelProps
{
	x: number;
	y: number;
}

interface ILevelSize
{
	width: number;
	height: number;
}

/**
 * Level class will contain details about the level being rendered by the renderer
 */
export const Level = ({x, y}: ILevelProps) =>
{
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const contextRef = useRef<CanvasRenderingContext2D | null>(null);
	const drawRef = useRef(0);
	const layersRef = useRef<Number[][]>();
	const previewRef = useRef({x: -1, y: -1});

	const [size, setSize] = useState<ILevelSize>({width: 320, height: 320});
	const squareSize = 32;

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas != null)
		{
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
		}
	}, []);

	const getCoords = ({clientX, clientY}: React.MouseEvent) => {
		const canvas = canvasRef.current;
		if (canvas == null)
		{
			return [-1, -1];
		}

		const {x, y} = canvas.getBoundingClientRect();
		const mouseX = clientX - x;
		const mouseY = clientY - y;
		return [Math.floor(mouseX / squareSize), Math.floor(mouseY / squareSize)];
	}

	const addTile = (x: number, y: number) => {
		const layers = layersRef.current;
		if (layers != null)
		{
			layers[x][y] = 1;
		}
	}

	const removeTile = (x: number, y: number) => {
		const layers = layersRef.current;
		if (layers != null)
		{
			layers[x][y] = 0;
		}
	}

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
	 * Handles mouse down events. For a level mouse downn means that the user is
	 * interacting with the level
	 */
	const handleMouseDown = (event: React.MouseEvent) => {
		event.stopPropagation();

		[x, y] = getCoords(event);

		switch(event.button)
		{
		case 0:
			drawRef.current = 1;
			if (x !== -1 && y !== -1)
			{
				addTile(x, y);
			}
			break;
		case 2:
			drawRef.current = -1;
			if (x !== -1 && y !== -1)
			{
				removeTile(x, y);
			}
			break;
		}
	}

	/**
	 * Handles mouse up events. For a level mouse up means drawing is ending
	 */
	const handleMouseUp = (event: React.MouseEvent) => {
		drawRef.current = 0;
	}

	/**
	 * Handles mouse move events. For a level mouse move means drawing
	 * as well as previews of tiles
	 */
	const handleMouseMove = (event: React.MouseEvent) => {
		const canvas = canvasRef.current;
		const context = contextRef.current;
		const [x, y] = getCoords(event);
		if (canvas == null || context == null || x === -1 || y === -1)
		{
			return;
		}
		
		const layers = layersRef.current;
		if (drawRef.current === 1 && layers != null)
		{
			addTile(x, y);
			context.fillStyle = "white"; // REMOVE ME: (For now white is drawn black is preview)

			// Draw new preview
			context.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
		}
		else if (drawRef.current === -1 && layers != null)
		{
			removeTile(x, y);
			restoreTile(x, y);
		}
		else
		{
			if (x !== previewRef.current.x || y !== previewRef.current.y)
			{
				if (previewRef.current.x !== -1 && previewRef.current.y !== -1)
				{
					restoreTile(previewRef.current.x, previewRef.current.y);
				}
	
				// Update preview position
				previewRef.current.x = x;
				previewRef.current.y = y;

				context.fillStyle = "black"; // REMOVE ME: (For now white is drawn black is preview)

				// Draw new preview
				context.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
			}
		}
	}

	/**
	 * Handles mouse out events. for a level mouse out means that the
	 * preview square disappears and only the commited level is shown.
	 */
	const handleMouseOut = (event: React.MouseEvent) => {
		const canvas = canvasRef.current;
		const context = contextRef.current;
		if (canvas == null || context == null)
		{
			return;
		}

		// Clear Preview
		restoreTile(previewRef.current.x, previewRef.current.y);

		// Reset drawing
		drawRef.current = 0;
		previewRef.current.x = -1;
		previewRef.current.y = -1;
	}

	const handleContextMenu = (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();
	}

	return (
		<canvas
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