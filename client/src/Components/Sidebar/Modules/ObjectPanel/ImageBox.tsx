import React from 'react'
import './ImageBox.css'

/**
 * Interface representing the props of the ImageBox
 */
interface imageProps
{
	image: string
}

/**
 * ImageBox is a square div showing an object
 * @returns JSX implementation of a ImageBox
 */
const ImageBox = (props: imageProps) =>
{
	/**
	 * Function starting the drag and drop event that adds objects to scenes
	 */
	const startDrag = (event: React.DragEvent) =>
	{
		event.dataTransfer.setData('drag-item', props.image);
	}

	return (
		<div className="block" draggable='true' onDragStart={startDrag}>
			<img src={props.image} alt={"character object"} />
		</div>
	)
}

export default ImageBox;