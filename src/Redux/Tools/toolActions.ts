export interface toolActions
{
	type: string;
}

export const switchTool = (tool: string): toolActions =>
{
	return {type: tool};
}