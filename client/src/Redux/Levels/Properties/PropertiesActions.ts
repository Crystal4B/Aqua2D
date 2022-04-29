/**
 * Interface representing the Actions possible on properties
 */
export interface PropertiesAction
{
	type: "SELECT_SCENE" | "SELECT_LAYER" | "SELECT_OBJECT"
	payload: {
		levelId?: string
		sceneId?: string
		layerId?: string
		objectIndex?: number
	}
}

/**
 * Function for creating an action for selecting objects
 * @param sceneId Id of scene owning the object
 * @param layerId Id of layer owning the object
 * @param objectIndex index of the object within the layer
 * @returns the action ready for dispatch
 */
export const selectObject = (sceneId: string, layerId: string, objectIndex: number) =>
{
    return {
        type: "SELECT_OBJECT",
        payload: {
            sceneId: sceneId,
            layerId: layerId,
            objectIndex: objectIndex
        }
    }
}