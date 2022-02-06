import React from "react";

/**
 * Converts mouse coordinates to canvas coordinates
 * @param event Mouse event being broken down to clientX and clientY
 * @returns [x,y] coordinates of the mouse on the canvas or [-1, -1] if an error occurred
 */
export const getCoords = ({target, clientX, clientY}: React.MouseEvent): [xCoord: number, yCoord: number] =>
{
	const targetCanvas = target as HTMLCanvasElement;
	
	// Get screen coordinates in relation to canvas
	const {x, y} = targetCanvas.getBoundingClientRect();
	var mouseX = clientX - x;
	var mouseY = clientY - y;

	// Convert to canvas coordinates
	const [xRatio, yRatio] = getRatio(targetCanvas);
	mouseX *= xRatio;
	mouseY *= yRatio;

	return [Math.floor(mouseX / 32), Math.floor(mouseY / 32)];
}

/**
 * getRatio extracts the ratio of canvas coordinates to canvas client coordinates of target canvas
 * @param target target html component that needs its ratio extracted
 * @returns ratio of canvas coordinates to canvas client size
 */
const getRatio = (target: HTMLCanvasElement): [xRatio: number, yRatio: number] =>
{
	return [target.width / target.clientWidth, target.width / target.clientHeight];
}