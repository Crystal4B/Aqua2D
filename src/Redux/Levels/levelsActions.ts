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
		name?: string
	}
}

/**
 * addLevel generates an action for adding a level to the levelState
 * @param levelName the name of the level being added
 * @returns the formatted action ready for dispatch
 */
export const addLevel = (levelName: string): levelAction =>
{
	return {type: "ADD", payload: {id: levelName}};
}

/**
 * renameLevel generates an action for renaming a level in the levelState
 * @param levelId the id of the level being renamed
 * @param newLevelName the desired name for the level being renamed
 * @returns the formatted action ready for dispatch
 */
export const renameLevel = (levelId: string, newLevelName: string): levelAction =>
{
	return {type: "RENAME", payload: {id: levelId, name: newLevelName}};
}

/**
 * removeLevel generates an action for removing a level from the state
 * @param levelId the id of the level being removed
 * @returns the formatted action ready for dispatch
 */
export const removeLevel = (levelId: string): levelAction =>
{
	return {type: "REMOVE", payload: {id: levelId}};
}

/**
 * addScene generates an action for adding a scene to a level in the state
 * @param levelId the id of the parent level
 * @param sceneName the name of the scene being added
 * @param xPos the desired x position for the scene
 * @param yPos the desired y position for the scene
 * @returns the formatted action ready for dispatch
 */
export const addScene = (levelId: string, sceneName: string, xPos: number, yPos:number): sceneAction =>
{
	return {type: "ADD", payload: {id: levelId, name: sceneName, position: {xPos: xPos, yPos: yPos}}};
}

/**
 * selectScene generates an action for selecting a scene from a level in the state
 * @param sceneId the id of the scene being selected
 * @returns the formatted action ready for dispatch
 */
export const selectScene = (sceneId: string): sceneAction =>
{
	return {type: "SELECT", payload: {id: sceneId}};
}

/**
 * moveScene generates an action for moving a scene
 * @param sceneId the id of the scene being moved
 * @param xPos the desired position on the x-axis
 * @param yPos the desired position on the y-axis
 * @returns the formatted action ready for dispatch
 */
export const moveScene = (sceneId: string, xPos: number, yPos: number): sceneAction =>
{
	return {type: "MOVE", payload: {id: sceneId, position:{xPos: xPos, yPos: yPos}}};
}

/**
 * renameScene generates an action for renaming a scene from a level in the state
 * @param sceneId the id of the scene being renamed
 * @param newSceneName the desired name of the scene being renamed
 * @returns the formatted action ready for dispatch
 */
export const renameScene = (sceneId: string, newSceneName: string): sceneAction =>
{
	return {type: "RENAME", payload: {id: sceneId, name: newSceneName}};
}

/**
 * removeScene generates an action for removing a scene from a level in the state
 * @param sceneName the id of the scene being removed
 * @returns the formatted action ready for dispatch
 */
export const removeScene = (sceneId: string): sceneAction =>
{
	return {type: "REMOVE", payload: {id: sceneId}};
}

/**
 * removeAllScenes generates an action for removing all scenes related to a specified level
 * @param levelId the id of the parent that is being cleared
 * @returns the formatted action ready for dispatch
 */
export const removeAllScenes = (levelId: string): sceneAction =>
{
	return {type: "REMOVE_ALL", payload: {id: levelId}}
}

/**
 * addLayer generates an action for adding a layer to a scene
 * @param sceneId the id of the parent scene
 * @param layerName the name of the layer being added
 * @returns the formatted action ready for dispatch
 */
export const addLayer = (sceneId: string, layerName: string): layerAction =>
{
	return {type: "ADD", payload: {id: sceneId, name: layerName}};
}

/**
 * renameLayer generates an action for changing the name of a layer in a scene
 * @param layerId the id of the layer
 * @param layerName the desired name for the layer
 * @returns the formatted action ready for dispatch
 */
 export const renameLayer = (layerId: string, layerName: string): layerAction =>
 {
	return {type: "RENAME", payload: {id: layerId, name: layerName}};
 }

/**
 * selectLayer generates an action for selecting a layer in a scene
 * @param layerId the id of the layer
 * @returns the formatted action ready for dispatch
 */
export const selectLayer = (layerId: string): layerAction =>
{
	return {type: "SELECT", payload: {id: layerId}};
}

/**
 * showLayer generates an action for showing and hiding a layer in a scene
 * @param layerId the id of the layer
 * @returns the formatted action ready for dispatch
 */
export const showLayer = (layerId: string): layerAction =>
{
	return {type: "SHOW", payload: {id: layerId}};
}

/**
 * lockLayer generates an action for locking and unlocking a layer in a scene
 * @param layerId the id of the layer
 * @returns the formatted action ready for dispatch
 */
 export const lockLayer = (layerId: string): layerAction =>
{
	return {type: "LOCK", payload: {id: layerId}};
}

/**
 * removeLayer generates an action for removing a layer from a scene
 * @param layerId the id of the layer
 * @returns the formatted action ready for dispatch
 */
export const removeLayer = (layerId: string): layerAction =>
{
	return {type: "REMOVE", payload: {id: layerId}};
}

/**
 * removeAllLayers generates an action for removing all layers related to a specified scene
 * @param sceneId the id of the parent that is being cleared
 * @returns the formatted action ready for dispatch
 */
 export const removeAllLayers = (sceneId: string): layerAction =>
 {
	 return {type: "REMOVE_ALL", payload: {id: sceneId}};
 }