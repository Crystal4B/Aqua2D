/**
 * levelsAction interface represent the action on the entire levels state
 */
export interface levelsAction
{
	type: "levelsAction";
	levelAction?: levelAction;
	sceneAction?: sceneAction;
	layerAction?: layerAction;
}

/**
 * levelAction interface represents the way level actions can be written
 */
export interface levelAction
{
	type: "ADD" | "RENAME" | "REMOVE";
	payload: {
		id: string,
		name?: string;
	}
}

export interface sceneAction
{
	type: "ADD" | "RENAME" | "MOVE" | "SELECT" | "REMOVE" | "REMOVE_ALL";
	payload: {
		id: string,
		name?: string,
		position?: {
			xPos: number,
			yPos: number
		}
	}
}

export interface layerAction
{
	type: "ADD" | "RENAME" | "MOVE" | "SELECT" | "SHOW" | "LOCK" | "REMOVE" | "REMOVE_ALL";
	payload: {
		id: string,
		name?: string | string[]
	}
}
// FIND NEW HOME
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
 * addLevel generates an action for adding a level to the levelState
 * @param levelName the name of the level being added
 * @returns the formatted action ready for dispatch
 */
export const addLevel = (levelName: string): levelsAction =>
{
	const levelAction: levelAction = {type: "ADD", payload: {id: levelName}};
	const {sceneAction, layerAction} = addScene(convertNameToId(levelName), "Scene 1", 150, 150);
	return {
		type: "levelsAction",
		levelAction: levelAction,
		sceneAction: sceneAction,
		layerAction: layerAction
	};
}

/**
 * renameLevel generates an action for renaming a level in the levelState
 * @param levelId the id of the level being renamed
 * @param newLevelName the desired name for the level being renamed
 * @returns the formatted action ready for dispatch
 */
export const renameLevel = (levelId: string, newLevelName: string): levelsAction =>
{
	return {
		type: "levelsAction",
		levelAction: {
			type: "RENAME",
			payload: {
				id: levelId,
				name: newLevelName
			}
		}
	};
}

/**
 * removeLevel generates an action for removing a level from the state
 * @param levelId the id of the level being removed
 * @returns the formatted action ready for dispatch
 */
export const removeLevel = (levelId: string): levelsAction =>
{
	const levelAction: levelAction = {type: "REMOVE", payload: {id: levelId}};
	const {sceneAction, layerAction} = removeAllScenes(levelId);
	return {
		type: "levelsAction",
		levelAction: levelAction,
		sceneAction: sceneAction,
		layerAction: layerAction
	};
}

/**
 * addScene generates an action for adding a scene to a level in the state
 * @param levelId the id of the parent level
 * @param sceneName the name of the scene being added
 * @param xPos the desired x position for the scene
 * @param yPos the desired y position for the scene
 * @returns the formatted action ready for dispatch
 */
export const addScene = (levelId: string, sceneName: string, xPos: number, yPos:number): levelsAction =>
{
	const sceneAction: sceneAction = {type: "ADD", payload: {id: levelId, name: sceneName, position: {xPos: xPos, yPos: yPos}}};
	const layerAction: layerAction = {type: "ADD", payload: {id: `${levelId}_${convertNameToId(sceneName)}`, name: ["Collision", "Layer 1"]}}
	return {
		type: "levelsAction",
		sceneAction: sceneAction,
		layerAction: layerAction
	}
}

/**
 * selectScene generates an action for selecting a scene from a level in the state
 * @param sceneId the id of the scene being selected
 * @returns the formatted action ready for dispatch
 */
export const selectScene = (sceneId: string): levelsAction =>
{
	return {
		type: "levelsAction",
		sceneAction: {
			type: "SELECT",
			payload: {
				id: sceneId
			}
		}
	}
}

/**
 * moveScene generates an action for moving a scene
 * @param sceneId the id of the scene being moved
 * @param xPos the desired position on the x-axis
 * @param yPos the desired position on the y-axis
 * @returns the formatted action ready for dispatch
 */
export const moveScene = (sceneId: string, xPos: number, yPos: number): levelsAction =>
{
	return {
		type: "levelsAction",
		sceneAction: {
			type:"MOVE",
			payload: {
				id: sceneId,
				position: {
					xPos: xPos,
					yPos: yPos
				}
			}
		}
	};
}

/**
 * renameScene generates an action for renaming a scene from a level in the state
 * @param sceneId the id of the scene being renamed
 * @param newSceneName the desired name of the scene being renamed
 * @returns the formatted action ready for dispatch
 */
export const renameScene = (sceneId: string, newSceneName: string): levelsAction =>
{
	return {
		type: "levelsAction",
		sceneAction: {
			type: "RENAME",
			payload: {
				id: sceneId,
				name: newSceneName
			}
		}
	};
}

/**
 * removeScene generates an action for removing a scene from a level in the state
 * @param sceneName the id of the scene being removed
 * @returns the formatted action ready for dispatch
 */
export const removeScene = (sceneId: string): levelsAction =>
{
	return {
		type: "levelsAction",
		sceneAction: {
			type: "REMOVE",
			payload: {
				id: sceneId
			}
		}
	};
}

/**
 * removeAllScenes generates an action for removing all scenes related to a specified level
 * @param levelId the id of the parent that is being cleared
 * @returns the formatted action ready for dispatch
 */
export const removeAllScenes = (levelId: string): levelsAction =>
{
	const sceneAction: sceneAction = {type: "REMOVE_ALL", payload: {id: levelId}};
	const {layerAction} = removeAllLayers(levelId);
	return {
		type: "levelsAction",
		sceneAction: sceneAction,
		layerAction: layerAction
	}
}

/**
 * addLayer generates an action for adding a layer to a scene
 * @param sceneId the id of the parent scene
 * @param layerName the name of the layer being added
 * @returns the formatted action ready for dispatch
 */
export const addLayer = (sceneId: string, layerName: string | string[]): levelsAction =>
{
	return {
		type: "levelsAction",
		layerAction: {
			type: "ADD",
			payload: {
				id: sceneId,
				name: layerName
			}
		}
	};
}

/**
 * renameLayer generates an action for changing the name of a layer in a scene
 * @param layerId the id of the layer
 * @param layerName the desired name for the layer
 * @returns the formatted action ready for dispatch
 */
 export const renameLayer = (layerId: string, layerName: string): levelsAction =>
 {
	return {
		type: "levelsAction",
		layerAction: {
			type: "RENAME",
			payload: {
				id: layerId,
				name: layerName
			}
		}
	};
 }

/**
 * selectLayer generates an action for selecting a layer in a scene
 * @param layerId the id of the layer
 * @returns the formatted action ready for dispatch
 */
export const selectLayer = (layerId: string): levelsAction =>
{
	return {
		type: "levelsAction",
		layerAction: {
			type: "SELECT",
			payload: {
				id: layerId
			}
		}
	};
}

/**
 * showLayer generates an action for showing and hiding a layer in a scene
 * @param layerId the id of the layer
 * @returns the formatted action ready for dispatch
 */
export const showLayer = (layerId: string): levelsAction =>
{
	return {
		type: "levelsAction",
		layerAction: {
			type: "SHOW",
			payload: {
				id: layerId
			}
		}
	};
}

/**
 * lockLayer generates an action for locking and unlocking a layer in a scene
 * @param layerId the id of the layer
 * @returns the formatted action ready for dispatch
 */
 export const lockLayer = (layerId: string): levelsAction =>
{
	return {
		type: "levelsAction",
		layerAction: {
			type: "LOCK",
			payload: {
				id: layerId
			}
		}
	};
}

/**
 * removeLayer generates an action for removing a layer from a scene
 * @param layerId the id of the layer
 * @returns the formatted action ready for dispatch
 */
export const removeLayer = (layerId: string): levelsAction =>
{
	return {
		type: "levelsAction",
		layerAction: {
			type: "REMOVE",
			payload: {
				id: layerId
			}
		}
	};
}

/**
 * removeAllLayers generates an action for removing all layers related to a specified level
 * @param levelId the id of the parent level that is being cleared
 * @returns the formatted action ready for dispatch
 */
 export const removeAllLayers = (levelId: string): levelsAction =>
 {
	 return {
		type: "levelsAction",
		layerAction: {
			type: "REMOVE_ALL",
			payload: {
				id: levelId
			}
		}
	}
 }