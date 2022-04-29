import Toolbar from "../Toolbar";
import ImageBox from "./ImageBox";

/**
 * The panel handling the managment of objects available for use in the game creation
 * @returns JSX Implemenation of the object panel
 */
const ObjectPanel = () => {
	return (
		<div className="panel">
			<div className="header">Objects</div>
			<Toolbar type='objects'/>
			<br></br>
			<div className="object-list" style={{height: "50vh"}}>
				<ImageBox image='/zombie.png'/>
				<ImageBox image='/player.png'/>
				<ImageBox image='/squidy.png'/>
			</div>
		</div>
	)
}

export default ObjectPanel;