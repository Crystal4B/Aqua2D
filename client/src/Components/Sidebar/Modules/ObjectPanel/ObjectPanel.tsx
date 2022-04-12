import Toolbar from "../Toolbar";
import ImageBox from "./ImageBox";

const ObjectPanel = () => {
	return (
		<div className="panel">
			<div className="header">Objects</div>
			<Toolbar type='objects'/>
			<br></br>
			<div className="properties-list" style={{height: "50vh"}}>
				<ImageBox image='/clipart4773647.png'/>
				<ImageBox image='/Young_Link_2D (1).png'/>
				<ImageBox image='/Zombie_back_sprite.png'/>
			</div>
		</div>
	)
}

export default ObjectPanel;