import { convertNameToId, DEFAULT_LEVEL_ID, DEFAULT_SCENE_ID } from "../../../Helpers/LevelsReduxHelper";
import { sceneAction } from "./sceneActions";

/**
 * Interface representing multiple scenes in a level
 */
export interface scenesState
{
	byId: {
		[levelId: string]: {
			data: {[sceneId: string]: sceneState}
			selectedId: string;
		}
	}
}

/**
 * Interface representing a scene in a level
 */
export interface sceneState
{
	id: string;
	levelId: string;
	sceneName: string;
	selected: boolean;
	position: {
		xPos: number;
		yPos: number;
	}
	size: {
		width: number;
		height: number;
	}
	tileset: {
		image?: string | undefined;
		tileWidth: number,
		tileHeight: number
	},
	connections: {
		up?: string,
		down?: string,
		left?: string,
		right?: string
	}
}

/**
 * Create a scene
 * @param levelId id of the parent level
 * @param sceneName desired scene name
 * @param selected boolean selection value
 * @param position in format {x, y}
 * @returns sceneState depicting desired scene
 */
const createNewScene = (levelId: string, sceneName: string, selected: boolean, position: {xPos: number, yPos: number}, size: {width: number, height: number}): sceneState =>
{
	const id = `${levelId}_${convertNameToId(sceneName)}`;
	return {
		id: id,
		levelId: levelId,
		sceneName: sceneName,
		selected: selected,
		position: position,
		size: size,
		tileset: {
			tileWidth: 32,
			tileHeight: 32
		},
		connections: {

		}
	}
}

/**
 * Method to create a initial / default state for the reducer
 * @returns a default scenesState
 */
const createDefaultState = (): scenesState =>
{
	return {
		byId: {
			[DEFAULT_LEVEL_ID]: {
				data: {
					[DEFAULT_SCENE_ID]: createNewScene(DEFAULT_LEVEL_ID, "Scene 1", false, {xPos: 200, yPos:200}, {width: 320, height: 320})
				},
				selectedId: DEFAULT_SCENE_ID
			}
		}
	}
}

/**
 * function for inverting the direction of a scene connection
 * @param dir the direction being inverted
 * @returns the inverted direction
 */
const invertDir = (dir: "up" | "down" | "left" | "right") =>
{
	switch(dir)
	{
	case "up":
		return "down";
	case "down":
		return "up";
	case "left":
		return "right";
	default:
		return "left";
	}
}

/**
 * sceneReducer made for parsing scene based actions in the engine
 * @param state a sceneState object storing all scene data
 * @param action a sceneAction object being used to update the state
 * @returns The new state of the scenes
 */
const sceneReducer = (state: scenesState = createDefaultState(), action: sceneAction): scenesState =>
{
	if (!action)
	{
		return state;
	}

	const {type, payload} = action;
	switch(type)
	{
	case "ADD_LEVEL":
		const id = convertNameToId(payload.levelId);
		var newScene = createNewScene(id, "Scene 1", false, {xPos: 150, yPos: 150}, {width: 320, height: 320});
		return {
			byId: {
				...state.byId,
				[id]: {
					data: {
						[newScene.id]: newScene
					},
					selectedId: newScene.id
				}
			}
		};
	case "ADD_SCENE":
		// Validate ? components
		var name = payload.name;
		if (!name || name === "DEFAULT")
		{
			const length = Object.entries(state).filter(([_, scene]) => scene.levelId === payload.levelId).length;
			name = `Scene ${length+1}`;
		}

		var position = payload.position;
		if (!position)
		{
			position = {xPos: 150, yPos: 150};
		}

		var size = payload.size;
		if (!size)
		{
			size = {width: 320, height: 320};
		}

		newScene = createNewScene(payload.levelId, name, false, position, size);
		return {
			byId: {
				...state.byId,
				[payload.levelId]: {
					...state.byId[payload.levelId],
					data: {
						...state.byId[payload.levelId].data,
						[newScene.id]: newScene
					}
				}
			}
		}
	case "CONNECT_SCENE":
		if (!payload.sceneId || !payload.connection)
			return state;

		return {
			byId: {
				...state.byId,
				[payload.levelId]: {
					...state.byId[payload.levelId],
					data: {
						...state.byId[payload.levelId].data,
						[payload.sceneId]: {
							...state.byId[payload.levelId].data[payload.sceneId],
							connections: {
								...state.byId[payload.levelId].data[payload.sceneId].connections,
								[invertDir(payload.connection.dir)]: payload.connection.sceneId
							}
						},
						[payload.connection.sceneId]: {
							...state.byId[payload.levelId].data[payload.connection.sceneId],
							connections: {
								...state.byId[payload.levelId].data[payload.connection.sceneId].connections,
								[payload.connection.dir]: payload.sceneId
							}
						}
					}
				}
			}
		}
	case "RENAME_SCENE":
		if (!payload.sceneId)
		{
			return state;
		}

		name = payload.name;
		if (!name)
		{
			name = "";
		}

		return {
			byId: {
				...state.byId,
				[payload.levelId]: {
					...state.byId[payload.levelId],
					data: {
						...state.byId[payload.levelId].data,
						[payload.sceneId]: {
							...state.byId[payload.levelId].data[payload.sceneId],
							sceneName: name
						}
					}
				}
			}
		};
	case "RESIZE_SCENE":
		size = payload.size;
		if (!payload.sceneId || !size)
			return state;

		return {
			byId: {
				...state.byId,
				[payload.levelId]: {
					...state.byId[payload.levelId],
					data: {
						...state.byId[payload.levelId].data,
						[payload.sceneId]: {
							...state.byId[payload.levelId].data[payload.sceneId],
							size: size
						}
					}
				}
			}
		}
	case "MOVE_SCENE":
		if (!payload.sceneId)
		{
			return state;
		}

		position = payload.position;
		if (!position)
		{
			position = {xPos: 150, yPos: 150};
		}

		return {
			byId: {
				...state.byId,
				[payload.levelId]: {
					...state.byId[payload.levelId],
					data: {
						...state.byId[payload.levelId].data,
						[payload.sceneId]: {
							...state.byId[payload.levelId].data[payload.sceneId],
							position: position
						}
					}
				}
			}
		};
	case "SWITCH_TILESET":
		if (!payload.sceneId || !payload.tileset?.image)
			return state;
	
		return {
			byId: {
				...state.byId,
				[payload.levelId]: {
					...state.byId[payload.levelId],
					data: {
						...state.byId[payload.levelId].data,
						[payload.sceneId]: {
							...state.byId[payload.levelId].data[payload.sceneId],
							tileset: {
								...state.byId[payload.levelId].data[payload.sceneId].tileset,
								image: payload.tileset.image
							}
						}
					}
				}
			}
		};
	case "RESIZE_TILES":
		if (!payload.sceneId || !payload.tileset?.tileWidth || !payload.tileset.tileHeight)
			return state;

		return {
			byId: {
				...state.byId,
				[payload.levelId]: {
					...state.byId[payload.levelId],
					data: {
						...state.byId[payload.levelId].data,
						[payload.sceneId]: {
							...state.byId[payload.levelId].data[payload.sceneId],
							tileset: {
								...state.byId[payload.levelId].data[payload.sceneId].tileset,
								tileWidth: payload.tileset.tileWidth,
								tileHeight: payload.tileset.tileHeight
							}
						}
					}
				}
			}
		};
	case "SELECT_SCENE":
		if (!payload.sceneId)
		{
			return state;
		}
		state.byId[payload.levelId].selectedId = payload.sceneId;
		return {
			byId: {
				...state.byId,
				[payload.levelId]: {
					...state.byId[payload.levelId],
					selectedId: payload.sceneId
				}
			}
		};
	case "REMOVE_SCENE":
		if (!payload.sceneId)
		{
			return state;
		}
		delete state.byId[payload.levelId].data[payload.sceneId];
		return state;

	default:
		return state;
	}
}

export default sceneReducer;