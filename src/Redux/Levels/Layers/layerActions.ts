export interface layerAction
{
	type: "ADD_LEVEL" | "ADD_SCENE" | "ADD_LAYER" | "RENAME_LAYER" | "MOVE_LAYER" | "SELECT_LAYER" | "SHOW_LAYER" | "LOCK_LAYER" | "REMOVE_LAYER" | "REMOVE_ALL_LAYERS";
	payload: {
		levelId?: string
		sceneId: string
		layerId?: string,
		name?: string | string[]
		option?: string
	}
}

/**
 * addLayer generates an action for adding a layer to a scene
 * @param sceneId the id of the parent scene
 * @param layerName the name of the layer being added
 * @returns the formatted action ready for dispatch
 */
export const addLayer = (sceneId: string, layerName: string | string[], option: "TOP" | "BOTTOM"): layerAction =>
{
	return {
		type: "ADD_LAYER",
		payload: {
			sceneId: sceneId,
			name: layerName,
			option: option
		}
	};
}

/**
 * renameLayer generates an action for changing the name of a layer in a scene
 * @param layerId the id of the layer
 * @param layerName the desired name for the layer
 * @returns the formatted action ready for dispatch
 */
export const renameLayer = (sceneId: string, layerId: string, layerName: string): layerAction =>
{
	return {
		type: "RENAME_LAYER",
		payload: {
			sceneId: sceneId,
			layerId: layerId,
			name: layerName
		}
	};
}

/**
 * selectLayer generates an action for selecting a layer in a scene
 * @param layerId the id of the layer
 * @returns the formatted action ready for dispatch
 */
export const selectLayer = (sceneId: string, layerId: string): layerAction =>
{
	return {
		type: "SELECT_LAYER",
		payload: {
			sceneId: sceneId,
			layerId: layerId
		}
	};
}

/**
 * showLayer generates an action for showing and hiding a layer in a scene
 * @param layerId the id of the layer
 * @returns the formatted action ready for dispatch
 */
export const showLayer = (sceneId: string, layerId: string): layerAction =>
{
	return {
		type: "SHOW_LAYER",
		payload: {
			sceneId: sceneId,
			layerId: layerId
		}
	};
}

/**
 * lockLayer generates an action for locking and unlocking a layer in a scene
 * @param layerId the id of the layer
 * @returns the formatted action ready for dispatch
 */
export const lockLayer = (sceneId: string, layerId: string): layerAction =>
{
	return {
		type: "LOCK_LAYER",
		payload: {
			sceneId: sceneId,
			layerId: layerId
		}
	};
}

/**
 * removeLayer generates an action for removing a layer from a scene
 * @param layerId the id of the layer
 * @returns the formatted action ready for dispatch
 */
export const removeLayer = (sceneId: string, layerId: string): layerAction =>
{
	return {
		type: "REMOVE_LAYER",
		payload: {
			sceneId: sceneId,
			layerId: layerId
		}
	};
}

/**
 * removeAllLayers generates an action for removing all layers related to a specified level
 * @param levelId the id of the parent level that is being cleared
 * @returns the formatted action ready for dispatch
 */
export const removeAllLayers = (levelId: string): layerAction =>
{
	return {
		type: "REMOVE_ALL_LAYERS",
		payload: {
			sceneId: levelId
		}
	};
}