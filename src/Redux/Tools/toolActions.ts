/**
 * toolAction is an interface representing the possible actions for the toolReducer
 */
export interface toolAction
{
	type: "SWITCHTOOL" | "SWITCHASSET" | "ROTATEASSET";
	payload: {
		tool?: string;
		asset?: ImageData;
		rotation?: number;
	};
}

/**
 * switchTool generates an action for switching tools in the toolReducer
 * @param tool string value representing the selected tool
 * @returns returns a formatted action for the switchTool action
 */
export const switchTool = (tool: string): toolAction =>
{
	return {type: "SWITCHTOOL", payload: {tool: tool}};
}

/**
 * switchAsset generates a action for switching assets in the toolReducer
 * @param asset ImageData object representing the asset being placed on the level
 * @returns returns a formatted action for the switchAsset action
 */
export const switchAsset = (asset: ImageData): toolAction =>
{
	return {type: "SWITCHASSET", payload: {asset: asset}};
}