export interface toolAction
{
	type: "SWITCHTOOL" | "SWITCHASSET" | "ROTATEASSET";
	payload: {
		tool?: string;
		asset?: ImageData;
		rotation?: number;
	};
}

export const switchTool = (tool: string): toolAction =>
{
	return {type: "SWITCHTOOL", payload: {tool: tool}};
}

export const switchAsset = (asset: ImageData): toolAction =>
{
	return {type: "SWITCHASSET", payload: {asset: asset}};
}