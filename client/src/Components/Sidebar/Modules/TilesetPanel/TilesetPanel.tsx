import Toolbar from '../Toolbar';
import './TilesetPanel.css'
import {getGridCoords} from '../../../../Helpers/TileHelper';
import { useDispatch, useSelector } from 'react-redux';
import React, { useRef, useState } from 'react';
import { switchTile } from '../../../../Redux/Tools/toolActions';
import { rootState } from '../../../../Redux/store';

/**
 * Panel handling the setting of tilesets as well as the selection of tiles for drawing
 * @returns JSX implementation of the TilesetPanel
 */
const TilesetPanel = () =>
{
	const tileset = useSelector<rootState, {image?: string, tileWidth: number, tileHeight: number}>(state => {
		const levelId = state.levels.levels.selectedId;
		const sceneId = state.levels.scenes.byId[levelId].selectedId;
		const tileset = state.levels.scenes.byId[levelId].data[sceneId].tileset;

		return tileset
	});

	const layerId = useSelector<rootState, string>(state => {
		const levelId = state.levels.levels.selectedId;
		const sceneId = state.levels.scenes.byId[levelId].selectedId;
		
		return state.levels.layers.byId[sceneId].selectedId;
	})

	var imageSrc = tileset.image;
	if (layerId.includes("Collision"))
	{
		imageSrc = "/collider.png";
	}

	const assetRef = useRef<HTMLImageElement>(null);
	const [selection, setSelection] = useState({xPos: 0, yPos: 0, selected: false});
	const dispatch = useDispatch();

	/**
	 * Function handling the update of tile selection
	 */
	const handleOnClick = ({target, clientX, clientY}: React.MouseEvent) => {
		const [x, y] = getGridCoords(target as HTMLElement, clientX, clientY, tileset.tileWidth, tileset.tileHeight);
		setSelection({xPos: x*tileset.tileWidth, yPos: y*tileset.tileHeight, selected: true});
		
		dispatch(switchTile(x, y));
	}

	return (
		<>
			<div className="content">
				<Toolbar type='tileset'/>
				<div className="tileset" style={{height: "50vh"}}>
					{selection.selected ? <div className='selection' style={{left:`${selection.xPos}px`, top:`${selection.yPos}px`}}></div> : null}
					<img ref={assetRef} onClick={handleOnClick} src={imageSrc}/>
				</div>
			</div>
		</> 
	)
}

export default TilesetPanel;