export interface toolAction
{
	type: string;
}

export const switchTool = (tool: string): toolAction =>
{
	return {type: tool};
}