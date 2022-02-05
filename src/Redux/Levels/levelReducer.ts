import { levelAction } from "./levelsActions";

/**
 * Interface for storing level & scene data
 */
export interface levelsState {
	levels: Array<levelState>
}

/**
 * Interface representing a level in a game
 */
interface levelState {
	levelName: string;
	levelSelected: boolean;
	scenes: Array<sceneState>;
}

/**
 * Interface representing a scene in a level
 */
interface sceneState {
	sceneName: string;
	sceneSelected: boolean;
}

/**
 * Create a level with default parameters
 * @param name the name being given to the level
 */
const createNewLevel = (name: string): levelState => {
	return {
		levelName: name,
		levelSelected: true,
		scenes: []
	}
}

/**
 * Create a scene with default parameters
 */
const createNewScene = (name: string): sceneState => {
	return {
		sceneName: name,
		sceneSelected: false
	}
}

/** 
 * Default State for a new Project
 */
const initialState: levelsState = {
	levels: [createNewLevel("Level 1")]
	
}

/**
 * Level Reducer made for parsing level based actions in the engine
 * @param state a levelsState object storing all level and scene data
 * @param action a levelAction object being used to update the state
 * @returns The new state of the levels
 */
const levelReducer = (state: levelsState = initialState, action: levelAction): levelsState => {
	const {type, payload} = action;
	switch(type)
	{
	case "ADD":
		if (payload.parent === "ROOT")
		{
			const newLevel = createNewLevel(payload.target);
			return {levels: [...state.levels, newLevel]};
		}
		else
		{
			const newScene = createNewScene(payload.target);
			return {
				levels: state.levels.map(
					(level) => level.levelName === payload.parent ? {...level, scenes:[...level.scenes, newScene]} : level
				)
			}
		}
	case "SELECT":
		return {
			levels: state.levels.map(
				(level) => level.levelName === payload.parent ? {...level, scenes: level.scenes.map(
					(scene) => scene.sceneName === payload.target ? {...scene, sceneSelected: true}: scene
				)} : level
			)
		};
	case "RENAME":
		var target = payload.parent;
		if (target === "ROOT")
		{
			target = payload.target;
		}
		const level = state.levels.find(level => level.levelName === target);
		if (level !== undefined && payload.newName !== undefined)
		{
			level.levelName = payload.newName;
		}
		return {levels: state.levels};
	case "REMOVE":
		if (payload.parent === "ROOT")
		{
			const index = state.levels.findIndex(level => level.levelName === payload.target);
			if (index !== undefined)
			{
				state.levels.splice(index, index);
			}
		}
		else
		{
			const level = state.levels.find(level => level.levelName === payload.parent);
			const index = level?.scenes.findIndex(scene => scene.sceneName === payload.target);
			if (index !== undefined)
			{
				level?.scenes.splice(index, index);
			}
		}
		return {levels: state.levels};
	default:
		return state;
	}
}

export default levelReducer;