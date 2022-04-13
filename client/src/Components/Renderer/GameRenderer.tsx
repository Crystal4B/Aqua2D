import { useEffect, useRef, useState } from "react";
import {createPortal} from "react-dom"
import { useSelector } from "react-redux";
import { sceneState } from "../../Redux/Levels/Scenes/sceneReducer";
import { objectState } from "../../Redux/Levels/Tilemap/tilemapReducer";
import { rootState } from "../../Redux/store";
import { tileState, toolState } from "../../Redux/Tools/toolReducer";

type Props = {
	container: HTMLDivElement
}

// Runs the game
const GameRenderer: React.FC<Props> = ({container}) =>
{
	// Initialise States for level
	const [size, setSize] = useState({width: 320, height: 320});

	const tileset = useSelector<rootState, sceneState['tileset']>(state => {
		const levelId = state.levels.levels.selectedId;
		const sceneId = state.levels.scenes.byId[levelId].selectedId;
		const tileset = state.levels.scenes.byId[levelId].data[sceneId].tileset;

		return tileset
	});
	const order = useSelector<rootState, string[]>(state => state.levels.layers.byId["Level_1_Scene_1"].order);
	const tilemapData = useSelector<rootState, {[layerId: string]: {tilemap: tileState[][], objects: objectState[]}}>(state => state.levels.tilemaps.byId["Level_1_Scene_1"].data);

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const contextRef = useRef<CanvasRenderingContext2D>();
	const requestRef = useRef<number>();

	// Load image
	const image = new Image();
	if (tileset.image)
	{
		image.src = tileset.image;
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
				const cx = x * tileset.tileWidth + tileset.tileWidth / 2;
				const cy = y * tileset.tileHeight +  tileset.tileHeight / 2;

				context.save();
				context.translate(cx, cy);
				context.rotate(tile.rotation * TO_RADIANS);
				context.translate(-cx, -cy);
			}
			context.drawImage(image, tile.xCoord * tileset.tileWidth, tile.yCoord * tileset.tileHeight, tileset.tileWidth, tileset.tileHeight, x * tileset.tileHeight, y * tileset.tileHeight, tileset.tileWidth, tileset.tileHeight);
			if (tile.rotation % 360 !== 0 || tile.rotation !== 0)
			{
				context.restore();
			}
		}
	}

	const run = () => {
		const context = contextRef.current;
		if (context)
		{
			// Draw level
			for (let i = order.length-1; i >= 0; i--)
			{
				const layerData = tilemapData[order[i]]

				for (let i = 0; i < layerData.tilemap.length; i++)
				{
					for (let j = 0; j < layerData.tilemap[i].length; j++)
					{
						if (layerData.tilemap[i][j].xCoord === -1 || layerData.tilemap[i][j].yCoord === -1)
						{
							continue;
						}

						draw(layerData.tilemap[i][j], i, j);
					}
				}

				for (let i = 0; i < layerData.objects.length; i++)
				{
					let image = new Image();
					image.src = layerData.objects[i].image;

					context.drawImage(image, layerData.objects[i].x, layerData.objects[i].y, layerData.objects[i].width, layerData.objects[i].height);
				}
			}
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

	return createPortal(<canvas ref={canvasRef} width={size.width}
			height={size.height} style={{height: '100%', width: '100%'}}/>, container);
}

export default GameRenderer;