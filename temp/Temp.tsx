
	/////////////////////// Drawing tools //////////////////////
	const TILE_SIZE = 20; // For the time being
	var drawing = false;
	var showSelection = false;
	var erasing = false;

	var squareStartX: number;
	var squareStartY: number;

	/**
	 * Method to get the canvas to client ratio
	 * @returns Ratios for width and height as number
	 */
	const getCanvasRatio = (): [number, number] =>
	{
		const canvas = canvasRef.current;
		if (!canvas)
			return [-1, -1];
 
		const {width, height} = canvas.getBoundingClientRect();
		const widthRatio = width / canvas.width;
		const heightRatio = height / canvas.height;

		return [widthRatio, heightRatio];
	}

	/**
	 * Method to draw a square on the level
	 * @param event React Mouse Event
	 * @returns Return means that an error occured
	 */
	const draw = (xCord: number, yCord: number) =>
	{
		const canvas = canvasRef.current;
		const ctx = contextRef.current;
		if (!canvas || !ctx)
			return;

		// Get Ratio
		const [widthRatio, heightRatio] = getCanvasRatio();
		if (widthRatio == -1)
			return;

		const scaledX = xCord / widthRatio;
		const scaledY = yCord / heightRatio;

		// Find Square pressed
		const xIndex = Math.floor(scaledX / TILE_SIZE) + 1;
		const yIndex = Math.floor(scaledY / TILE_SIZE) + 1;

		const gridCentreX = (TILE_SIZE * xIndex) - (TILE_SIZE/2);
		const gridCentreY = (TILE_SIZE * yIndex) - (TILE_SIZE/2);
		
		// Draw
		ctx.fillStyle = '#000000'
		ctx.fillRect((gridCentreX-(TILE_SIZE/2)), (gridCentreY-(TILE_SIZE/2)), TILE_SIZE+1, TILE_SIZE+1);
	}

	/**
	 * Method to erase a square on the level
	 * @param event React Mouse Event
	 * @returns Return means that an error occured
	 */
	const erase = (xCord: number, yCord: number) =>
	{
		const canvas = canvasRef.current;
		const ctx = contextRef.current;
		if (!canvas || !ctx)
			return;

		// Get Ratio
		const [widthRatio, heightRatio] = getCanvasRatio();
		if (widthRatio == -1)
			return;

		const scaledX = xCord / widthRatio;
		const scaledY = yCord / heightRatio;

		// Find Square pressed
		const xIndex = Math.floor(scaledX / TILE_SIZE) + 1;
		const yIndex = Math.floor(scaledY / TILE_SIZE) + 1;

		const gridCentreX = (TILE_SIZE * xIndex) - (TILE_SIZE/2);
		const gridCentreY = (TILE_SIZE * yIndex) - (TILE_SIZE/2);
		
		// Draw
		ctx.fillStyle = '#FFFFFF'
		ctx.fillRect((gridCentreX-(TILE_SIZE/2)), (gridCentreY-(TILE_SIZE/2)), TILE_SIZE+1, TILE_SIZE+1);
	}
	 
	/**
	 * Method to fill in a selected area on the canvas
	 * @param nStartX The starting X coordinate
	 * @param nStartY The starting Y coordinate
	 * @param nEndX The ending X coordinate
	 * @param nEndY The ending Y coordinate
	 * @returns Return means that an error occured
	 */
	const fill = (nStartX:number, nStartY:number, nEndX:number, nEndY:number) =>
	{
		const canvas = canvasRef.current;
		const ctx = contextRef.current;
		if (!canvas || !ctx)
			return;
		
		const [widthRatio, heightRatio] = getCanvasRatio();
		if (widthRatio == -1)
			return;

		// Scale args down
		nStartX /= widthRatio;
		nStartY /= heightRatio;
		nEndX /= widthRatio;
		nEndY /= heightRatio;

		// Find Start and End Squares
		var nStartXIndex = Math.floor(nStartX / TILE_SIZE) + 1;
		var nStartYIndex = Math.floor(nStartY / TILE_SIZE) + 1;
		var nEndXIndex = Math.floor(nEndX / TILE_SIZE) + 1;
		var nEndYIndex = Math.floor(nEndY / TILE_SIZE) + 1;
		
		// Rearrange coordinates for drawing
		if (nStartYIndex > nEndYIndex)
		{
			var temp = nStartYIndex;
			nStartYIndex = nEndYIndex;
			nEndYIndex = temp;
		}
		if (nEndXIndex < nStartXIndex)
		{
			var temp = nEndXIndex;
			nEndXIndex = nStartXIndex;
			nStartXIndex = temp;
		}

		// Fill in Map
		for (var nRow = nStartXIndex; nRow <= nEndXIndex; nRow++)
		{
			for (var nCol = nStartYIndex; nCol <= nEndYIndex; nCol++)
			{
				const gridCentreX = (TILE_SIZE * nRow) - (TILE_SIZE/2);
				const gridCentreY = (TILE_SIZE * nCol) - (TILE_SIZE/2);

				// Draw
				ctx.fillStyle = '#000000'
				ctx.fillRect((gridCentreX - (TILE_SIZE/2)), (gridCentreY - (TILE_SIZE/2)), TILE_SIZE+1, TILE_SIZE+1);
			}
		}
	}

	/**
	 * Handles mouse movement functionality for the level
	 * @param movementX -> how far the mouse moved on the x-axis
	 * @param movementY -> how far the mouse moved on the y-axis
	 */
	function handleMouseMove({clientX, clientY}: React.MouseEvent)
	{
		console.log("moving", drawing);
		if (drawing)
		{
			draw(clientX, clientY);
		}

		if (erasing)
			erase(clientX, clientY);

		if (showSelection)
		{
			// TODO: draw a selection outline for the cursor
			return;
		}
	}

	/**
	 * Handles mouse down functionality for the level
	 */
	function handleMouseDown(event: React.MouseEvent)
	{
		event.stopPropagation();
		event.nativeEvent.stopPropagation();
		const {button, clientX, clientY} = event;

		console.log("mousedown", button);
		switch(button)
		{
		case 0:
			// Right Click
			squareStartX = clientX;
			squareStartY = clientY;
			break;
		case 1:
			// Middle Click
			erasing = true;
			erase(clientX, clientY);
			break;
		case 2:
			// Left Click
			drawing = true;
			draw(clientX, clientY);
			break;
		case 3:
			// Side button 1
			break;
		case 4:
			// Side button 2
			break;
		}
	}

	/**
	 * Handles mouse up functionality for the level
	 */
	function handleMouseUp({button, clientX, clientY}: React.MouseEvent)
	{
		switch(button)
		{
		case 0:
			// Right Click
			fill(squareStartX, squareStartY, clientX, clientY);
			break;
		case 1:
			// Middle Click
			erasing = false;
			break;
		case 2:
			// Left Click
			drawing = false;
			break;
		case 3:
			// Side button 1
			break;
		case 4:
			// Side button 2
			break;
		}
	}