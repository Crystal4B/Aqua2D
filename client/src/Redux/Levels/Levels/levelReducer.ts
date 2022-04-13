import {convertNameToId, DEFAULT_LEVEL_ID} from "../../../Helpers/LevelsReduxHelper";
import {levelAction} from "./levelsActions";

/**
 * Interface for storing level & scene data
 */
export interface levelsState
{
	byId: {
		[levelId: string]: levelState
	};
	selectedId: string;
}

/**
 * Interface representing a level in a game
 */
export interface levelState
{
	id: string;
	levelName: string;
}

/**
 * Create a level with default parameters
 * @param name the name being given to the level
 */
const createNewLevel = (levelName: string): levelState =>
{
	const id = convertNameToId(levelName);
	return {
		id: id,
		levelName: levelName,
	}
}

/** 
 * Default State for a new level
 */
const createDefaultState = (): levelsState =>
{
	return {
		byId: {
			[DEFAULT_LEVEL_ID]: {
				id: DEFAULT_LEVEL_ID,
				levelName: "Level 1"
			}
		},
		selectedId: DEFAULT_LEVEL_ID
	}
}

/**
 * levelReducer made for parsing level based actions in the engine
 * @param state a levelState object storing all level data
 * @param action a levelAction object being used to update the state
 * @returns The new state of the levels
 */
const levelReducer = (state: levelsState = createDefaultState(), action: levelAction): levelsState =>
{
	if (action === undefined)
	{
		return state;
	}

	const {type, payload} = action;
	switch(type)
	{
	case "ADD_LEVEL":
		var name = payload.levelId;
		if (name === "DEFAULT")
		{
			const length = Object.keys(state).length;
			name = `Level ${length+1}`;
		}
		const newLevel = createNewLevel(name);
		return {...state, byId: {...state.byId, [newLevel.id]: newLevel}};
	case "RENAME_LEVEL":
		if (!payload.name)
		{
			return state
		}

		state.byId[payload.levelId] = {...state.byId[payload.levelId], levelName: payload.name};
		return state;
	case "SELECT_SCENE":
		return {...state, selectedId: payload.levelId};
	case "REMOVE_LEVEL":
		delete state.byId[payload.levelId];
		return state;
	default:
		return state;
	}
}

export default levelReducer;