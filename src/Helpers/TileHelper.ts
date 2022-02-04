/**
 * Converts mouse coordinates to canvas coordinates
 * @param event Mouse event being broken down to clientX and clientY
 * @returns [x,y] coordinates of the mouse on the canvas or [-1, -1] if an error occurred
 */
export const getCoords = (e: React.MouseEvent) => {
	const target = e.target as HTMLElement;
	const {x, y} = target.getBoundingClientRect();

	const mouseX = e.clientX - x;
	const mouseY = e.clientY - y;
	return [Math.floor(mouseX / 32), Math.floor(mouseY / 32)];
}