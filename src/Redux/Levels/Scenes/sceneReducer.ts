import { convertNameToId, DEFAULT_LEVEL_ID, DEFAULT_SCENE_ID } from "../../../Helpers/LevelsReduxHelper";
import { sceneAction } from "./sceneActions";

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
		size: size
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

		var newScene = createNewScene(payload.levelId, name, false, position, size);
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
	case "RENAME_SCENE":
		if (!payload.sceneId)
		{
			return state;
		}

		var name = payload.name;
		if (!name)
		{
			name = "Default_Name";
		}

		state.byId[payload.levelId].data[payload.levelId] = {...state.byId[payload.levelId].data[payload.sceneId], sceneName: name}; // Take levelId also
		return state;
	case "MOVE_SCENE":
		if (!payload.sceneId)
		{
			return state;
		}

		var position = payload.position;
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