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