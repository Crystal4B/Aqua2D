import Toolbar from '../Toolbar';
import './TilesetPanel.css'
import {getCoords} from '../../../../Helpers/TileHelper';
import { useDispatch } from 'react-redux';
import React, { useRef, useState } from 'react';
import { switchAsset } from '../../../../Redux/Tools/toolActions';

const TilesetPanel = () =>
{
	const assetRef = useRef<HTMLImageElement>(null);
	const [selection, setSelection] = useState({xPos: 0, yPos: 0, selected: false});
	const dispatch = useDispatch();

	const handleOnClick = (e: React.MouseEvent) => {
		const [x, y] = getCoords(e);
		setSelection({xPos: x*32, yPos: y*32, selected: true});
		
		// MOVE TO FUNCTION
		const canvas = document.createElement('canvas');
		canvas.width = 32;
		canvas.height = 32;
		
		// Prepare canvas for drawing
		const context = canvas.getContext("2d");
		// Get asset
		const asset = assetRef.current;
		if (asset !== null && context !== null)
		{
			context.drawImage(asset, x * 32, y * 32, 32, 32, 0, 0, 32, 32);
			const data = context.getImageData(0,0,32,32);
			dispatch(switchAsset(data));
		}
	}

	return (
		<div className="panel">
			<div className="header">Tileset</div>
			<div className="content">
				<Toolbar />
				<div className="tileset" style={{height: "50vh"}}>
					{selection.selected ? <div className='selection' style={{left:`${selection.xPos}px`, top:`${selection.yPos}px`}}></div> : null}
					<img ref={assetRef} onClick={handleOnClick} src={require("./TileEditorSpritesheet.png")}/>
				</div>
			</div>
		</div> 
	)
}

export default TilesetPanel;