import React, { useEffect, useRef, useState } from "react";

interface ILevelProps
{
	key: number;
	scale: number;
}

interface ILevelSize
{
	width: number;
	height: number;
}
interface ILevelPosition
{
	x: number;
	y: number;
}

/**
 * Level class will contain details about the level being rendered by the renderer
 */
function Level(props: ILevelProps)
{
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const contextRef = useRef<CanvasRenderingContext2D | null>(null);

	const [dragging, setDragging] = useState<boolean>(false);
	const [position, setPosition] = useState<ILevelPosition>({x: 300, y: 300});
	const [size, setSize] = useState<ILevelSize>({width: 300, height: 300});

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas != null)
		{
			const context = canvas.getContext("2d");
			contextRef.current = context;

			if (context != null)
			{
				// Initialize to default color
				context.fillStyle = "#696a79";
				context.fillRect(0,0, canvas.width, canvas.height);
			}
		}
	}, []);

	/**
	 * Handles mouse down functionality for the level
	 */
	function handleMouseDown()
	{
		setDragging(true);
	}

	/**
	 * Handles mouse up functionality for the level
	 */
	function handleMouseUp()
	{
		setDragging(false);
	}

	/**
	 * Handles mouse out functionality for the level
	 */
	function handleMouseOut()
	{
		setDragging(false);
	}

	/**
	 * Handles mouse movement functionality for the level
	 * @param movementX -> how far the mouse moved on the x-axis
	 * @param movementY -> how far the mouse moved on the y-axis
	 */
	function handleMouseMove({movementX, movementY}: React.MouseEvent)
	{
		if (dragging)
		{
			setPosition({x: position.x + movementX, y: position.y + movementY});
		}
	}

	return (
		<canvas
			key={props.key}
			width={size.width}
			height={size.height}
			style={{left: position.x, top: position.y}}

			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseOut={handleMouseOut}
			onMouseMove={handleMouseMove}
			ref={canvasRef}
		/>
	);
}

// Export the level class
export default Level;