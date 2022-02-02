import Toolbar from './Toolbar';
import {getCoords} from '../../../Helpers/TileHelper';

const TilesetModule = () => {
    return (
        <div className="panel">
            <div className="header">Tileset</div>
            <div className="content">
                <Toolbar />
                <div className="tileset" style={{height: "250px"}}>
                    <img src={"https://assets.codepen.io/21542/TileEditorSpritesheet.2x_2.png"} />
                </div>
            </div>
        </div> 
    )
}

export default TilesetModule;