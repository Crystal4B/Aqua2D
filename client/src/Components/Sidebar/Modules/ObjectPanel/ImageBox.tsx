import React from 'react'
import './ImageBox.css'

interface imageProps
{
	image: string
}

const ImageBox = (props: imageProps) =>
{
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