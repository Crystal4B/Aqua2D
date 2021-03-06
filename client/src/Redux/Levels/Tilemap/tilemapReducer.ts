import { convertNameToId, DEFAULT_SCENE_ID } from "../../../Helpers/LevelsReduxHelper"
import { tileState } from "../../Tools/toolReducer"
import { tilemapAction } from "./tilemapActions"

/**
 * Interface representing the state of keyboard controls
 */
export interface keyboardState
{
	up: string
	down: string
	left: string
	right: string
	attack: string
}

/**
 * Interface representing the npc behaviour controls
 */
export interface npcState
{
	//TODO: future npc options
}

/**
 * Interface representing an object in the game
 */
export interface objectState
{
	x: number
	y: number
	width: number
	height: number
	image: string
	name: string
	controller: {
		type: string
		control: keyboardState | npcState
	}
}

/**
 * interface representing the tilemaps in the scenes
 */
export interface tilemapsState
{
	byId: {
		[sceneId: string]: {
			data: {[layerId: string]: {
					tilemap: tileState[][]
					objects: objectState[]
					tileSize: {
						tileWidth: number,
						tileHeight: number
					}
				}
			}
		}
	}
}

/**
 * Function for creating a new tilemap from scratch
 */
function createNewTilemap(): tileState[][]
{
	return Array(320/32).fill(0).map(row => new Array(320/32).fill(createDefaultTile()));
}

/**
 * function to create a default/null tilestate
 * @returns a default tileState
 */
function createDefaultTile(): tileState
{
	return {xCoord: -1, yCoord: -1, rotation: 0}
}

/**
 * Function for creating the default state of the store
 */
const createDefaultState = (): tilemapsState =>
{
	return {
		byId: {
			[DEFAULT_SCENE_ID]: {
				data: {
					[`${DEFAULT_SCENE_ID}_Collision`]: {
						tilemap: createNewTilemap(),
						objects: [],
						tileSize: {
							tileWidth: 32,
							tileHeight: 32
						}
					},
					[`${DEFAULT_SCENE_ID}_Layer_1`]: {
						tilemap: createNewTilemap(),
						objects: [],
						tileSize: {
							tileWidth: 32,
							tileHeight: 32
						}
					}
				}
			}
		}
	}
}

/**
 * Function for creating the default controller for an object
 * @param type of object
 * @returns formatted control state for object
 */
const createDefaultController = (type: string): keyboardState | npcState =>
{
	switch(type)
	{
	case 'player':
		return {up: "W", down: "S", left: "A", right: "D", attack: "E"};
	default:
		return {};
	}
}

/**
 * Function for resizing an array
 * @param array being resized
 * @param newWidth the new width for the array
 * @param newHeight the new height for the array
 * @returns the resized array
 */
const resizeArray = (array: tileState[][], newWidth: number, newHeight: number): tileState[][] =>
{
	let heightDelta = array[0].length - newHeight;
	if (heightDelta !== 0)
	{
		for (let i = 0; i < array.length; i++)
		{
			if (heightDelta > 0)
			{
				array[i].length = newHeight;
			}
			else
			{
				let deltaClone = heightDelta;
				while (deltaClone < 0)
				{
					array[i].push(createDefaultTile());
					deltaClone++;
				}
			}
		}
	}

	let widthDelta = array.length - newWidth;
	if (widthDelta > 0)
	{
		array.length = newWidth;
	}
	else
	{
		while (widthDelta < 0)
		{
			array.push(new Array(newHeight).fill(createDefaultTile()));
			widthDelta++;
		}
	}

	return array;
}

/**
 * tilemapReducer made for parsing tilemap based actions in the engine
 * @param state a tilemapsState object storing all tilemap data
 * @param action a tilemapAction object being used to update the state
 * @returns The new state of the tilemaps
 */
const tilemapReducer = (state: tilemapsState = createDefaultState(), action: tilemapAction): tilemapsState =>
{
	
	const {type, payload} = action;
	switch(type)
	{
	case "ADD_LEVEL":
	case "ADD_SCENE":
		if (!payload.levelId)
			return state;

		// Handle levelId
		let levelId = payload.levelId;
		if (type === "ADD_LEVEL")
		{
			levelId = convertNameToId(levelId);
		}

		// Handle sceneName
		let sceneName = "Scene_1";
		if (type === "ADD_SCENE")
		{
			if (!payload.name)
				return state;

			sceneName = convertNameToId(payload.name);
		}
		
		const sceneId = `${levelId}_${sceneName}`;
		let layerIds = [`${sceneId}_Collision`, `${sceneId}_Layer_1`];

		return {
			byId: {
				...state.byId,
				[sceneId]: {
					data: {
						[layerIds[0]]: {
							tilemap: createNewTilemap(),
							objects: [],
							tileSize: {
								tileWidth: 32,
								tileHeight: 32
							}
						},
						[layerIds[1]]: {
							tilemap: createNewTilemap(),
							objects: [],
							tileSize: {
								tileWidth: 32,
								tileHeight: 32
							}
						}
					}
				}
			}
		}
	case "ADD_LAYER":
		if (!payload.name)
			return state;
		
		const layerId = `${payload.sceneId}_${convertNameToId(payload.name)}`;

		return {
			byId: {
				...state.byId,
				[payload.sceneId]: {
					data: {
						...state.byId[payload.sceneId].data,
						[layerId]: {
							tilemap: createNewTilemap(),
							objects: [],
							tileSize: {
								tileWidth: 32,
								tileHeight: 32
							}
						}
					}
				}
			}
		}
	case "ADD_TILE":
		if (!payload.tile || payload.xPos === undefined || payload.yPos === undefined)
			return state;

		state.byId[payload.sceneId].data[payload.layerId].tilemap[payload.xPos][payload.yPos] = {...payload.tile};
		return state;
	case "REMOVE_TILE":
		if (payload.xPos === undefined || payload.yPos === undefined)
			return state;

		state.byId[payload.sceneId].data[payload.layerId].tilemap[payload.xPos][payload.yPos] = createDefaultTile();
		return state;
	case "ADD_OBJECT":
		if (!payload.object)
			return state;

		state.byId[payload.sceneId].data[payload.layerId].objects = [...state.byId[payload.sceneId].data[payload.layerId].objects, payload.object];
		return state;
	case "MOVE_OBJECT":
		if (payload.objectIndex === undefined || payload.xPos === undefined || payload.yPos === undefined)
			return state;
		
		state.byId[payload.sceneId].data[payload.layerId].objects[payload.objectIndex] = {
			...state.byId[payload.sceneId].data[payload.layerId].objects[payload.objectIndex],
			x: payload.xPos,
			y: payload.yPos
		}
		return {...state};
	case "RESIZE_SCENE":
		const width = payload.size?.width;
		const height = payload.size?.height;
		if (width === undefined || height === undefined)
			return state;

		let resizeScene = state.byId[payload.sceneId].data;
		for (const key of Object.keys(resizeScene))
		{
			let layer = resizeScene[key];
			let tileSize = layer.tileSize;

			let tilemap = resizeArray(layer.tilemap, width/tileSize.tileWidth, height/tileSize.tileHeight);

			layer.tilemap = tilemap;

			resizeScene[key] = layer;
		}

		state.byId[payload.sceneId].data = resizeScene;
		return state;
	case "RESIZE_TILES":
		let tileWidth = payload.tileset?.tileWidth;
		let tileHeight = payload.tileset?.tileHeight;
		if (tileWidth === undefined || tileHeight === undefined)
			return state;

		let w = tileWidth;
		let h = tileHeight;

		let resizeTilesScene = state.byId[payload.sceneId].data;
		for (const key of Object.keys(resizeTilesScene))
		{
			let layer = resizeTilesScene[key];

			layer.tileSize = {tileWidth: w, tileHeight: h}
			resizeTilesScene[key] = layer;
		}

		state.byId[payload.sceneId].data = resizeTilesScene
		return state;
	case "UPDATE_OBJECT":
		let object = payload.object;
		let objectIndex = payload.objectIndex;

		if (!object || objectIndex === undefined)
			return state;

		let originalObject = state.byId[payload.sceneId].data[payload.layerId].objects[objectIndex];
		if (originalObject.controller.type !== object.controller.type)
			object.controller.control = createDefaultController(object.controller.type);

		state.byId[payload.sceneId].data[payload.layerId].objects[objectIndex] = object;
		return {...state};
	default:
		return state;
	}
}

export default tilemapReducer;