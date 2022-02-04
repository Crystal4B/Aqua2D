import Toolbar from '../Toolbar';
import './TilesetPanel.css'
import {getCoords} from '../../../../Helpers/TileHelper';

const TilesetPanel = () => {
	return (
		<div className="panel">
			<div className="header">Tileset</div>
			<div className="content">
				<Toolbar />
				<div className="tileset" style={{height: "50vh"}}>
					<img src={"https://assets.codepen.io/21542/TileEditorSpritesheet.2x_2.png"} />
				</div>
			</div>
		</div> 
	)
}

export default TilesetPanel;