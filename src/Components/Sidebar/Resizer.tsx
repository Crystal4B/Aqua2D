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

	const handleMouseOver = () => {
		setActive(true);
	}

	const handleMouseOut = () => {
		setActive(false);
		dragRef.current =false;
	}

	const handleMouseDown = ({button}: React.MouseEvent) => {
		if (button === 0)
		{
			dragRef.current = true;
		}
	}

	const handleMouseUp = ({button}: React.MouseEvent) => {
		if (button === 0)
		{
			dragRef.current =false;
		}
	}

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