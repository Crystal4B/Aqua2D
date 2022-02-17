import { addLayer, addLevel, addScene, layerAction, levelAction, levelsAction, removeAllLayers, removeAllScenes, removeLevel, removeScene, sceneAction, selectLayer } from "./levelsActions";
import { levelsIntent } from "./levelsIntent";

/**
 * Interface for storing level & scene data
 */
export interface levelsState
{
	levels: {[id: string]: levelState};
	selectedLevelId: string;
	scenes: {[id: string]: sceneState};
	selectedSceneId: string;
	layers: {[id: string]: layerState};
	selectedLayerId: string;
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
}

/**
 * Interface representing a layer in a scene
 */
export interface layerState
{
	id: string;
	sceneId: string;
	layerName: string;
	selected: boolean;
	locked: boolean;
	visible: boolean;
}

/**
 * convertNameToId converts a name of an object to the format required for ids
 * @param name the name of the object being converted
 * @returns the name of the object converted to id format
 */
const convertNameToId = (name: string): string =>
{
	const id = name.replaceAll(" ", "_");
	return id;
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
 * Create a scene
 * @param levelId id of the parent level
 * @param sceneName desired scene name
 * @param selected boolean selection value
 * @param position in format {x, y}
 * @returns sceneState depicting desired scene
 */
const createNewScene = (levelId: string, sceneName: string, selected: boolean, position: {xPos: number, yPos: number}): sceneState =>
{
	const id = `${levelId}_${convertNameToId(sceneName)}`;
	return {
		id: id,
		levelId: levelId,
		sceneName: sceneName,
		selected: selected,
		position: position
	}
}

/**
 * Create a layer
 * @param sceneId id of parent scene
 * @param layerName desired layer name
 * @param selected boolean selection value
 * @returns layerState depicting desired layer
 */
const createNewLayer = (sceneId: string, layerName: string, selected: boolean): layerState =>
{
	const id = `${sceneId}_${convertNameToId(layerName)}`;
	return {
		id: id,
		sceneId: sceneId,
		layerName: layerName,
		selected: selected,
		locked: false,
		visible: true
	}
}

/** 
 * Default State for a new Project
 */
const initialState: levelsState =
{
	levels: {Level_1: createNewLevel("Level 1")},
	selectedLevelId: "Level_1",
	scenes: {Level_1_Scene_1: createNewScene("Level_1", "Scene 1", true, {xPos: 150, yPos: 150})},
	selectedSceneId: "Level_1_Scene_1",
	layers: {
		Scene_1_Collision: createNewLayer("Level_1_Scene_1", "Collision", false),
		Scene_1_Layer_1: createNewLayer("Level_1_Scene_1", "Layer 1", true),
	},
	selectedLayerId: "Scene_1_Layer_1"
}

/**
 * rootReducer made for parsing level based actions in the engine
 * @param state a levelsState object storing all level and scene data
 * @param action a levelsAction object being used to update the state
 * @returns The new state of the levels
 */
const rootReducer = (state: levelsState = initialState, action: levelsIntent): levelsState =>
{
	var levelAction, sceneAction, layerAction;
	switch(action.type)
	{
	case "ADD":
		switch(action.state)
		{
		case "LEVEL":
			if (action.payload.levelName === undefined) return state; // broken action
			levelAction = addLevel(action.payload.levelName);
		case "SCENE":
			if (action.payload.levelName === undefined || action.payload.sceneName === undefined) return state; // broken action
			sceneAction = addScene(action.payload.levelName, action.payload.sceneName, 100, 100);
		case "LAYER":
			if (action.payload.sceneName === undefined || action.payload.layerName === undefined) return state; // broken action
			layerAction = addLayer(action.payload.sceneName, action.payload.layerName);
		}
		break;
	case "REMOVE":
		switch(action.state)
		{
		case "LEVEL":
			if (action.payload.levelName === undefined) return state; // broken action
			levelAction = removeLevel(action.payload.levelName);
		case "SCENE":
			if (action.payload.levelName === undefined || action.payload.sceneName === undefined) return state; // broken action
			sceneAction = removeAllScenes(action.payload.levelName);
		case "LAYER":
			if (action.payload.sceneName === undefined) return state; // broken action
			layerAction = removeAllLayers(action.payload.sceneName);
		}
	}

	return {
		...state,
		levels: levelReducer(state.levels, levelAction),
		scenes: sceneReducer(state.scenes, state.selectedSceneId, sceneAction),
		layers: layerReducer(state.layers, state.selectedLayerId, layerAction),
	};
}

/**
 * levelReducer made for parsing level based actions in the engine
 * @param state a levelState object storing all level data
 * @param action a levelAction object being used to update the state
 * @returns The new state of the levels
 */
const levelReducer = (state: {[id: string]: levelState}, action: levelAction | undefined): {[id: string]: levelState} =>
{
	if (action === undefined)
	{
		return state;
	}

	const {type, payload} = action;
	switch(type)
	{
	case "ADD":
		var name = payload.id;
		if (name === "DEFAULT")
		{
			const length = Object.keys(state).length;
			name = `Level ${length+1}`;
		}
		const newLevel = createNewLevel(name);
		return {...state, [newLevel.id]: newLevel};

	case "RENAME":
		// Validate ? components
		var newName = payload.name;
		if (newName === undefined)
		{
			newName = "Default_Name";
		}

		state[payload.id] = {...state[payload.id], levelName: newName};
		return state;

	case "REMOVE":
		delete state[payload.id];
		return state;

	default:
		return state;
	}
}

/**
 * sceneReducer made for parsing scene based actions in the engine
 * @param state a sceneState object storing all scene data
 * @param action a sceneAction object being used to update the state
 * @returns The new state of the scenes
 */
const sceneReducer = (state: {[id: string]: sceneState}, selectedSceneId: string, action: sceneAction | undefined): {[id: string]: sceneState} =>
{
	if (action === undefined)
	{
		return state;
	}

	const {type, payload} = action;
	switch(type)
	{
	case "ADD":
		// Validate ? components
		var name = payload.name;
		if (name === undefined || name === "DEFAULT")
		{
			const length = Object.entries(state).filter(([_, scene]) => scene.levelId === payload.id).length;
			name = `Scene ${length+1}`;
		}

		var position = payload.position;
		if (position === undefined)
		{
			position = {xPos: 150, yPos: 150};
		}

		const newScene = createNewScene(payload.id, name, false, position)
		return {...state, [newScene.id]: newScene};

	case "RENAME":
		var name = payload.name;
		if (name === undefined)
		{
			name = "Default_Name";
		}

		state[payload.id] = {...state[payload.id], sceneName: name};
		return state;

	case "MOVE":
		var position = payload.position;
		if (position === undefined)
		{
			position = {xPos: 150, yPos: 150};
		}

		state[payload.id] = {...state[payload.id], position: position};
		return state;

	case "SELECT":
		state[selectedSceneId] = {...state[selectedSceneId], selected: false}
		state[payload.id] = {...state[payload.id], selected: true};
		return state;

	case "REMOVE":
		delete state[payload.id];
		return state;

	default:
		return state;
	}
}

/**
 * layerReducer made for parsing layer based actions in the engine
 * @param state a layerState object storing all layer data
 * @param action a layerAction object being used to update the state
 * @returns The new state of the layers
 */
const layerReducer = (state: {[id: string]: layerState}, selectedLayerId: string, action: layerAction | undefined): {[id: string]: layerState} =>
{
	if (action === undefined)
	{
		return state;
	}

	const {type, payload} = action;
	switch(type)
	{
	case "ADD":
		var name = payload.name;
		if (name === undefined || name === "DEFAULT")
		{
			const length = Object.entries(state).filter(([_, layer]) => layer.sceneId === payload.id).length;
			name = `Layer ${length+1}`;
		}

		const newLayer = createNewLayer(payload.id, name, false);
		return {...state, [newLayer.id]: newLayer};

	case "RENAME":
		var name = payload.name;
		if (name === undefined)
		{
			name = "DEFAULT_NAME";
		}
		
		state[payload.id] = {...state[payload.id], layerName: name};
		return state;

	case "MOVE":
		return state;

	case "SELECT":
		state[selectedLayerId] = {...state[selectedLayerId], selected: false}
		state[payload.id] = {...state[payload.id], selected: true};
		return state;

	case "SHOW":
		state[payload.id] = {...state[payload.id], visible: !state[payload.id].visible};
		return state;

	case "LOCK":
		state[payload.id] = {...state[payload.id], locked: !state[payload.id].locked};
		return state;

	case "REMOVE":
		delete state[payload.id];
		return state;

	default:
		return state;
	}
}

export default rootReducer;