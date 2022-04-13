import { convertNameToId, DEFAULT_SCENE_ID } from "../../../Helpers/LevelsReduxHelper"
import { tileState } from "../../Tools/toolReducer"
import { tilemapAction } from "./tilemapActions"

export interface objectState
{
	x: number
	y: number
	width: number
	height: number
	image: string
}

/**
 * TODO: COMMENT
 */
export interface tilemapsState
{
	byId: {
		[sceneId: string]: {
			data: {[layerId: string]: {
					tilemap: tileState[][]
					objects: objectState[]
				}
			}
		}
	}
}

/**
 * TODO: COMMENT
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
 * TODO: COMMENT
 */
const createDefaultState = (): tilemapsState =>
{
	return {
		byId: {
			[DEFAULT_SCENE_ID]: {
				data: {
					[`${DEFAULT_SCENE_ID}_Collision`]: {
						tilemap: createNewTilemap(),
						objects: []
					},
					[`${DEFAULT_SCENE_ID}_Layer_1`]: {
						tilemap: createNewTilemap(),
						objects: []
					}
				}
			}
		}
	}
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
		var levelId = payload.levelId;
		if (type === "ADD_LEVEL")
		{
			levelId = convertNameToId(levelId);
		}

		// Handle sceneName
		var sceneName = "Scene_1";
		if (type === "ADD_SCENE")
		{
			if (!payload.name)
				return state;

			sceneName = convertNameToId(payload.name);
		}
		
		const sceneId = `${levelId}_${sceneName}`;
		var layerIds = [`${sceneId}_Collision`, `${sceneId}_Layer_1`];

		return {
			byId: {
				...state.byId,
				[sceneId]: {
					data: {
						[layerIds[0]]: {
							tilemap: createNewTilemap(),
							objects: []
						},
						[layerIds[1]]: {
							tilemap: createNewTilemap(),
							objects: []
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
							objects: []
						}
					}
				}
			}
		}
	case "ADD_TILE":
		if (!payload.tile || !payload.xPos || !payload.yPos)
			return state;

		state.byId[payload.sceneId].data[payload.layerId].tilemap[payload.xPos][payload.yPos] = {...payload.tile};
		return state;
	case "REMOVE_TILE":
		if (!payload.xPos || !payload.yPos)
			return state;

		state.byId[payload.sceneId].data[payload.layerId].tilemap[payload.xPos][payload.yPos] = createDefaultTile();
		return state;
	case "ADD_OBJECT":
		if (!payload.object)
			return state;

		state.byId[payload.sceneId].data[payload.layerId].objects = [...state.byId[payload.sceneId].data[payload.layerId].objects, payload.object];
		return state;
	case "MOVE_OBJECT":
		if (payload.objectIndex === undefined || !payload.xPos || !payload.yPos)
			return state;
		
		state.byId[payload.sceneId].data[payload.layerId].objects[payload.objectIndex] = {
			...state.byId[payload.sceneId].data[payload.layerId].objects[payload.objectIndex],
			x: payload.xPos,
			y: payload.yPos
		}
		return state;
	default:
		return state;
	}
}

export default tilemapReducer;