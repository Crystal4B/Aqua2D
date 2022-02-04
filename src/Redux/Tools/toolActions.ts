export interface switchTool
{
	type: string;
}

export const switchTool = (tool: string): switchTool =>
{
	return {type: tool};
}