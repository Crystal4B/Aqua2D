/**
 * Converts mouse coordinates to canvas coordinates
 * @param event Mouse event being broken down to clientX and clientY
 * @returns [x,y] coordinates of the mouse on the canvas or [-1, -1] if an error occurred
 */
export const getCanvasCoords = (target: HTMLElement, clientX: number, clientY: number): [xCoord: number, yCoord: number] =>
{
	// Get screen coordinates in relation to canvas
	var [xCoord, yCoord] = getLocalizedCoords(target, clientX, clientY);

	// Convert to canvas coordinates
	const [xRatio, yRatio] = getRatio(target as HTMLCanvasElement);
	xCoord *= xRatio;
	yCoord *= yRatio;

	return [xCoord, yCoord];
}

/**
 * Function for converting mouse coordinates to Tile-grid coordinates
 * @param target element being targetted
 * @param clientX the x position of the mouse
 * @param clientY the y position of the mouse
 * @param tileWidth the width of tiles
 * @param tileHeight the height of tiles
 * @returns the Coordinates in the tilegrid
 */
export const getGridCoords = (target: HTMLElement, clientX: number, clientY: number, tileWidth: number, tileHeight: number) =>
{
	const [xCoord, yCoord] = getCanvasCoords(target, clientX, clientY);
	return [Math.floor(xCoord / tileWidth), Math.floor(yCoord / tileHeight)];
}

/**
 * getRatio extracts the ratio of canvas coordinates to canvas client coordinates of target canvas
 * @param target html component that needs its ratio extracted
 * @returns ratio of canvas coordinates to canvas client size
 */
const getRatio = (target: HTMLCanvasElement): [xRatio: number, yRatio: number] =>
{
	return [target.width / target.clientWidth, target.height / target.clientHeight];
}

/**
 * getLocalizedCoords converts mouse coordinates to html element coordinates of target element
 * @param target html element that we are localizing coordinates to
 * @param mouseX the mouse position on the x-axis
 * @param mouseY the mouse position on the y-axis
 * @returns the localized coordinates in format [x, y]
 */
export const getLocalizedCoords = (target: HTMLElement, mouseX: number, mouseY: number): [xCoord: number, xCoord: number] =>
{
	const {x, y} = target.getBoundingClientRect();
	return [mouseX - x, mouseY - y];
}