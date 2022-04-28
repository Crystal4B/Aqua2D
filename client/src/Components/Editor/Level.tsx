import React, {useEffect, useMemo, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getCanvasCoords, getGridCoords} from "../../Helpers/TileHelper";
import { layerState } from "../../Redux/Levels/Layers/layerReducer";
import { selectObject } from "../../Redux/Levels/Properties/PropertiesActions";
import { selectScene } from "../../Redux/Levels/Scenes/sceneActions";
import { sceneState } from "../../Redux/Levels/Scenes/sceneReducer";
import { addObject, moveObject, resetTile, setTile } from "../../Redux/Levels/Tilemap/tilemapActions";
import { objectState } from "../../Redux/Levels/Tilemap/tilemapReducer";
import {rootState} from "../../Redux/store";
import {tileState, toolState} from "../../Redux/Tools/toolReducer";

export interface ILevelProps
{
	levelId: string;
	sceneId: string;
	xOffset: number;
	yOffset: number;
	scale: number;
	selected: boolean;
	move: (sceneId: string, xPos: number, yPos: number) => void;
}

/**
 * Level class will contain details about the level being rendered by the renderer
 */
export const Level = ({levelId, sceneId, xOffset, yOffset, scale, selected, move}: ILevelProps) =>
{
	const toolbarSettings = useSelector<rootState, toolState>(state => state.toolbar);
	const sceneData = useSelector<rootState, sceneState>(state => state.levels.scenes.byId[levelId].data[sceneId]);
	const order = useSelector<rootState, string[]>(state => state.levels.layers.byId[sceneId].order);
	const selectedLayerId = useSelector<rootState, string>(state => state.levels.layers.byId[sceneId].selectedId);
	const layerData = useSelector<rootState, {[layerId: string]: layerState}>(state => state.levels.layers.byId[sceneId].data)
	const tilemapData = useSelector<rootState, {[layerId: string]: {tilemap: tileState[][], objects: objectState[]}}>(state => state.levels.tilemaps.byId[sceneId].data);
	const dispatch = useDispatch();

	const [redraw, setRedraw] = useState(false);
	const [drag, setDrag] = useState<number | null>(null);
	const dragRef = useRef({x: 0, y: 0});
	const locationRef = useRef({x: sceneData.position.xPos, y: sceneData.position.yPos});

	// Load image
	const image = useMemo(() => {
		var memoImage = new Image();
		if (sceneData.tileset.image)
		{
			memoImage.src = sceneData.tileset.image;
		}
		return memoImage;
	}, [sceneData.tileset.image]);

	const collisionImage = new Image();
	if (selectedLayerId.includes("Collision"))
	{
		collisionImage.src = "/collider.png";
	}

	// Initilise References for level
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const contextRef = useRef<CanvasRenderingContext2D | null>(null);
	const mouseDownRef = useRef(false);
	const previewRef = useRef({x: -1, y: -1});

		/**
	 * draw completes a drawing of a single tile on the canvas
	 * @param tile Tile being drawn onto the screen
	 * @param x the x position in tileset coordinates
	 * @param y the y position in tileset coordinates
	 */
	const draw = useMemo(() => (image: HTMLImageElement, tile: tileState, x: number, y: number) =>
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
				const cx = x * sceneData.tileset.tileWidth + sceneData.tileset.tileWidth / 2;
				const cy = y * sceneData.tileset.tileHeight +  sceneData.tileset.tileHeight / 2;

				context.save();
				context.translate(cx, cy);
				context.rotate(tile.rotation * TO_RADIANS);
				context.translate(-cx, -cy);
			}
			context.drawImage(image, tile.xCoord * sceneData.tileset.tileWidth, tile.yCoord * sceneData.tileset.tileHeight, sceneData.tileset.tileWidth, sceneData.tileset.tileHeight, x * sceneData.tileset.tileWidth, y * sceneData.tileset.tileHeight, sceneData.tileset.tileWidth, sceneData.tileset.tileHeight);
			if (tile.rotation % 360 !== 0 || tile.rotation !== 0)
			{
				context.restore();
			}
		}
	}, []);

	useEffect(() =>
	{
		const canvas = canvasRef.current;
		if (canvas == null)
		{
			return;
		}
		
		const context = canvas.getContext("2d");
		contextRef.current = context;

		if (context != null)
		{
			// Clear scene
			context.clearRect(0, 0, canvas.width, canvas.height);

			// Draw level
			for (let i = order.length-1; i >= 0; i--)
			{
				const layer = layerData[order[i]];
				if (!layer.visible)
				{
					continue;
				}

				const layerTileData = tilemapData[order[i]]

				for (let i = 0; i < layerTileData.tilemap.length; i++)
				{
					for (let j = 0; j < layerTileData.tilemap[i].length; j++)
					{
						if (layerTileData.tilemap[i][j].xCoord === -1 || layerTileData.tilemap[i][j].yCoord === -1)
						{
							continue;
						}

						if (layer.id.includes("Collision"))
						{
							draw(collisionImage, layerTileData.tilemap[i][j], i, j);
						} else {
							draw(image, layerTileData.tilemap[i][j], i, j);
						}
					}
				}

				for (let i = 0; i < layerTileData.objects.length; i++)
				{
					drawObject(layerTileData.objects[i])
				}
			}
		}
	}, [draw, tilemapData, layerData, redraw, order, image, collisionImage]);

	/**
	 * Renders a preview of the selected tile on the canvas
	 * @param x position of tile on the x-axis
	 * @param y position of tile on the y-axis
	 */
	const previewTile = (x: number, y: number) =>
	{
		const context = contextRef.current;
		if (context != null)
		{
			// Remove tile in space
			context.clearRect(x * sceneData.tileset.tileWidth, y * sceneData.tileset.tileHeight, sceneData.tileset.tileWidth, sceneData.tileset.tileHeight);

			for (let i = order.length-1; i >= 0; i--)
			{
				const layerId = order[i];

				if (layerId === selectedLayerId)
				{
					if (toolbarSettings.tool === "Draw")
					{
						// Draw preview tile
						if (selectedLayerId.includes("Collision"))
						{
							draw(collisionImage, toolbarSettings.tile, x, y);
						} else {
							draw(image, toolbarSettings.tile, x, y);
						}
					}
				}
				else
				{
					const layerData = tilemapData[order[i]]
					if (selectedLayerId.includes("Collision"))
					{
						continue;
					} else {
						draw(image, layerData.tilemap[x][y], x, y);
					}
				}

			}

		}

		previewRef.current.x = x;
		previewRef.current.y = y;
	}

	/**
	 * Adds a tile to the layers saved for the level
	 * @param x position of tile on the x-axis
	 * @param y position of tile on the y-axis
	 */
	const addTile = (x: number, y: number) =>
	{
		dispatch(setTile(sceneId, selectedLayerId, x, y, toolbarSettings.tile));
		restoreTile(x, y);
	}

	/**
	 * Removes a tile from the layers saved for the level
	 * @param x position of tile on the x-axis
	 * @param y position of tile on the y-axis
	 */
	const removeTile = (x: number, y: number) =>
	{
		dispatch(resetTile(sceneId, selectedLayerId, x, y));
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
			context.clearRect(x * sceneData.tileset.tileWidth, y * sceneData.tileset.tileHeight, sceneData.tileset.tileWidth, sceneData.tileset.tileHeight);
			for (let i = order.length-1; i >= 0; i--)
			{
				const layer = layerData[order[i]];
				if (!layer.visible)
				{
					continue;
				}

				const layerTileData = tilemapData[order[i]]
				if (layer.id.includes("Collision"))
				{
					draw(collisionImage, layerTileData.tilemap[x][y], x, y);
				} else {
					draw(image, layerTileData.tilemap[x][y], x, y);
				}

				for (const object of layerTileData.objects)
				{
					drawObject(object);
				}
			}

		}
	}

	/**
	 * Function for drawing objects on the canvas
	 * @param object Object being drawn
	 * @returns null if canvas context is not defined yet
	 */
	const drawObject = (object: objectState) =>
	{
		const context = canvasRef.current?.getContext("2d");
		if (!context)
			return;

		let image = new Image();
		image.src = object.image;
		context.drawImage(image, object.x, object.y, object.width, object.height);
	}

	/**
	 * Used to reset the drawing references for the level
	 */
	const resetDrawing = (hard: boolean = false) =>
	{
		mouseDownRef.current = false;
		
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
	const handleMouseDown = ({target, clientX, clientY, button}: React.MouseEvent) =>
	{
		if (button === 0 || button === 2)
		{
			mouseDownRef.current = true;
		}

		const [x, y] = getGridCoords(target as HTMLElement, clientX, clientY, sceneData.tileset.tileWidth, sceneData.tileset.tileHeight);
		switch(button)
		{
		case 0:
			if (toolbarSettings.tool === "Draw")
			{
				addTile(x, y);
			}
			else if (toolbarSettings.tool === "Erase")
			{
				removeTile(x, y);
			}
			else if (toolbarSettings.tool === "Move")
			{
				const [xCoord, yCoord] = getCanvasCoords(target as HTMLElement, clientX, clientY);
				imageHit(xCoord, yCoord);

				dragRef.current = {x: clientX, y: clientY};
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
	const handleMouseMove = ({target, clientX, clientY}: React.MouseEvent) =>
	{
		if (!selected)
		{
			return;
		}

		const canvas = canvasRef.current;
		const context = contextRef.current;
		const [x, y] = getGridCoords(target as HTMLElement, clientX, clientY, sceneData.tileset.tileWidth, sceneData.tileset.tileHeight);
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
				const mouseX = clientX - x;
				const mouseY = clientY - y;

				dragRef.current = {x: clientX, y: clientY}

				if (drag !== null)
				{
					const layerTileData = tilemapData[selectedLayerId]
					dispatch(moveObject(sceneId, selectedLayerId, drag, layerTileData.objects[drag].x + mouseX, layerTileData.objects[drag].y + mouseY));
					setRedraw(!redraw);
				} else {
					move(sceneId, locationRef.current.x + mouseX, locationRef.current.y + mouseY);
					locationRef.current = {x: locationRef.current.x + mouseX, y: locationRef.current.y + mouseY}
				}
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
				if ((x !== previewRef.current.x || y !== previewRef.current.y) && (x !== tilemapData[selectedLayerId].tilemap.length && y !== tilemapData[selectedLayerId].tilemap[0].length && x >= 0 && y >= 0))
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
			else
			{
				// Update preview only when mouse enters a new square
				if ((x !== previewRef.current.x || y !== previewRef.current.y) && (x !== tilemapData[selectedLayerId].tilemap.length && y !== tilemapData[selectedLayerId].tilemap[0].length && x >= 0 && y >= 0))
				{
					// Restore tile if preview is already drawn on canvas
					restoreTile(previewRef.current.x, previewRef.current.y);

					// Update preview
					previewTile(x, y);
				}
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

	/**
	 * Function for handling the dragOver event. preventing default to capture the data
	 * @param event drag event being fired
	 */
	const handleDragOver = (event: React.DragEvent) =>
	{
		event.preventDefault();
	}

	/**
	 * Function for handling the drop event for transfering objects into a scene
	 * @param event drag event being fired broken down into dataTransfer, target, clientX, clientY
	 */
	const handleDrop = ({dataTransfer, target, clientX, clientY}: React.DragEvent) =>
	{
		let imageLink = dataTransfer.getData('drag-item');
		const [xCoord, yCoord] = getCanvasCoords(target as HTMLElement, clientX, clientY);

		drawObject({x: xCoord, y: yCoord, width: 32, height: 50, image: imageLink, name: "Object", controller: {type: "npc", control: {}}});
		dispatch(addObject(sceneId, selectedLayerId, {x: xCoord, y: yCoord, width: 32, height: 50, image: imageLink, name: "Object", controller: {type: "npc", control: {}}}));
	}

	/**
	 * Image hit updates the drag section to a image if its clicked
	 * @param x The x location being checked
	 * @param y The y location being checked
	 */
	const imageHit = (x: number, y: number) =>
	{
		let originalValue = drag;

		let hitImage = null;

		const layerTileData = tilemapData[selectedLayerId]
		for (let i = 0; i < layerTileData.objects.length; i++)
		{
			let image = layerTileData.objects[i];
			let imageXHit = x > image.x && x < image.x + image.width;
			let imageYHit = y > image.y && y < image.y + image.height;

			if (imageXHit && imageYHit)
			{
				hitImage = i;
				break;
			}
		}

		setDrag(hitImage);
		if (selected && hitImage !== null)
			dispatch(selectObject(sceneId, selectedLayerId, hitImage));
		else if (!selected || originalValue !== null)
			dispatch(selectScene(levelId, sceneData.id));
	}

	return (
		<canvas
			className={`level ${selected ? "selected" : ""}`}
			width={sceneData.size.width}
			height={sceneData.size.height}
			style={{
				left: `${(sceneData.position.xPos + xOffset)}px`,
				top: `${(sceneData.position.yPos + yOffset)}px`,
				width: `${sceneData.size.width * scale}px`,
				height: `${sceneData.size.height * scale}px`
			}}
			ref={canvasRef}

			onDragOver={handleDragOver}
			onDrop={handleDrop}

			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseMove={handleMouseMove}
			onMouseOut={handleMouseOut}
			onContextMenu={handleContextMenu}
		/>
	);
}

export default Level;