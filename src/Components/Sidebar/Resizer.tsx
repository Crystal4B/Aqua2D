import { useRef, useState } from "react";
import './Resizer.css';

interface iResizerProps {
	orientation: string;
}

const Resizer = ({orientation}: iResizerProps) => {
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