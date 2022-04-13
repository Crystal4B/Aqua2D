/**
 * toolAction is an interface representing the possible actions for the toolReducer
 */
export interface toolAction
{
	type: "SWITCHTOOL" | "SWITCHTILESET" | "SWITCHTILE" | "ROTATETILE";
	payload: {
		tool?: string;
		tileset?: string;
		tile?: {
			xCoord?: number;
			yCoord?: number;
			rotation?: number;
		}
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
export const switchTile = (xCoord: number, yCoord: number): toolAction =>
{
	return {type: "SWITCHTILE", payload: {tile: {xCoord: xCoord, yCoord: yCoord}}};
}

// TODO: DOCS
export const rotationTile = (rotation: number) =>
{
	return {type: "ROTATETILE", payload: {tile: {rotation: rotation}}};
}