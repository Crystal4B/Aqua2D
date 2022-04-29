import { useRef, useState } from "react";
import './Resizer.css';

/**
 * resizerProps represents the requried props for the operation of the resizer
 */
interface resizerProps {
	orientation: string;
}

/**
 * Resizer is a functional component that allows the user to resize it's parent object
 * @param orientation the positioning of the resizer on the x or y axis
 * @returns JSX code for the resizer
 */
const Resizer = ({orientation}: resizerProps) => {
	const dragRef = useRef(false);
	const [active, setActive] = useState(false);

	/**
	 * Function handling the onHover functionality of the resizer
	 */
	const handleMouseOver = () => {
		setActive(true);
	}

	/**
	 * Function hiding the onHover functionality of the resize
	 */
	const handleMouseOut = () => {
		setActive(false);
		dragRef.current =false;
	}

	/**
	 * Function handling the mouse down event on the resizer
	 */
	const handleMouseDown = ({button}: React.MouseEvent) => {
		if (button === 0)
		{
			dragRef.current = true;
		}
	}

	/**
	 * Function handling the mouse up event on the resizer
	 */
	const handleMouseUp = ({button}: React.MouseEvent) => {
		if (button === 0)
		{
			dragRef.current =false;
		}
	}

	/**
	 * Function handling the mouse move event on the resizer
	 */
	const handleMouseMove = (e: React.MouseEvent) => {
		if (dragRef.current === true)
		{
			//func(e);
		}
	}

	return (
		<div className={`resizer ${orientation}`}
			onMouseOver={handleMouseOver} 
			onMouseOut={handleMouseOut} 
			onMouseDown={handleMouseDown} 
			onMouseUp={handleMouseUp} 
			onMouseMove={handleMouseMove}>

			{active ? <div className="line"></div> : null}
		</div>
	)
}

export default Resizer;