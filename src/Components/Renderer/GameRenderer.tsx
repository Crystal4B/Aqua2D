import { useEffect, useRef, useState } from "react";
import {createPortal} from "react-dom"
import { useSelector } from "react-redux";
import { rootState } from "../../Redux/store";
import { toolState } from "../../Redux/Tools/toolReducer";

type Props = {
	container: HTMLDivElement
}

// Runs the game
const GameRenderer: React.FC<Props> = ({container}) =>
{
	const tileset = useSelector<rootState, toolState['tileset']>(state => state.toolbar.tileset);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const contextRef = useRef<CanvasRenderingContext2D>();
	const requestRef = useRef<number>();

	// Load image
	const image = new Image();
	if (tileset)
	{
		image.src = tileset;
	}

	const run = () => {
		const context = contextRef.current;
		if (context)
		{
			context.clearRect(0, 0, 20, 20);
			context.fillStyle = '#fff';
			context.fillRect(0, 0, 20, 20);
		}

		// Call next animtaion frame
		requestRef.current = requestAnimationFrame(run);
	}

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas)
		{
			return;
		}
		
		const context = canvas.getContext("2d");
		if (context)
		{
			contextRef.current = context;

			context.fillStyle = '#000'
			context.fillRect(0, 0, canvas.width, canvas.height);
		}

		requestRef.current = requestAnimationFrame(run);
		return () => {
			if(requestRef.current !== undefined)
			{
				cancelAnimationFrame(requestRef.current);
			}
		}
	}, [])

	return createPortal(<canvas ref={canvasRef} style={{height: '100%', width: '100%'}}/>, container);
}

export default GameRenderer;