import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";

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
				context.fillStyle = "#ffffff";
				context.fillRect(0,0, canvas.width, canvas.height);
			}
		}
	}, []);


	return (
		<div>
			<Draggable>
				<canvas
					width={size.width}
					height={size.height}
					style={{left: x, top: y}}
					ref={canvasRef}
				/>
			</Draggable>
		</div>
	);
}

// Export the level class
export default Level;