import { levelAction } from "./levelsActions";

/**
 * Interface for storing level & scene data
 */
export interface levelsState {
	levels: Array<levelState>;
	selectedIndex: number;
}

/**
 * Interface representing a level in a game
 */
export interface levelState {
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
	xPos: number;
	yPos: number;
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
		sceneSelected: false,
		xPos: -1,
		yPos: -1
	}
}

/** 
 * Default State for a new Project
 */
const initialState: levelsState = {
	levels: [createNewLevel("Level 1")],
	selectedIndex: 0
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
			var levelName = payload.target;
			if (levelName === "DEFAULT")
			{
				levelName = `Level ${state.levels.length + 1}`;
			}

			const newLevel = createNewLevel(levelName);
			return {...state, levels: [...state.levels, newLevel]};
		}
		else
		{
			var sceneName = payload.target;
			if (sceneName === "DEFAULT")
			{
				const scenesLength = state.levels.find((level) => level.levelName === payload.parent)?.scenes.length;
				if (scenesLength !== undefined)
				{
					sceneName = `Scene ${scenesLength + 1}`
				}
			}

			const newScene = createNewScene(sceneName);
			return {
				...state,
				levels: state.levels.map(
					(level) => level.levelName === payload.parent ? {...level, scenes:[...level.scenes, newScene]} : level
				)
			}
		}
	case "SELECT":
		return {
			...state,
			levels: state.levels.map(
				(level) => level.levelName === payload.parent ? {...level, scenes: level.scenes.map(
					(scene) => scene.sceneName === payload.target ? {...scene, sceneSelected: !scene.sceneSelected} : scene
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
		return {...state, levels: state.levels};
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
		return {...state, levels: state.levels};
	default:
		return state;
	}
}

export default levelReducer;