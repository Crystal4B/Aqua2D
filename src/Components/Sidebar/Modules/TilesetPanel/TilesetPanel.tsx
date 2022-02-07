import Toolbar from '../Toolbar';
import './TilesetPanel.css'
import {getCoords} from '../../../../Helpers/TileHelper';
import { useDispatch } from 'react-redux';
import React, { useRef, useState } from 'react';
import { switchTile, switchTileset } from '../../../../Redux/Tools/toolActions';

const TilesetPanel = () =>
{
	const assetRef = useRef<HTMLImageElement>(null);
	const inputRef = useRef(null);
	const [selection, setSelection] = useState({xPos: 0, yPos: 0, selected: false});
	const dispatch = useDispatch();

	const handleOnClick = (e: React.MouseEvent) => {
		const [x, y] = getCoords(e);
		setSelection({xPos: x*32, yPos: y*32, selected: true});
		
		dispatch(switchTile(x, y));
	}

	const handleDragOver = (e: React.MouseEvent) =>
	{
		e.preventDefault();
		e.stopPropagation();
	}

	const validateImage = (file: File) =>
	{
		const VALID_TYPES = ['image/jpeg', 'image/png'];
		return VALID_TYPES.indexOf(file.type) !== -1;
	}

	const handleDrop = (e: React.DragEvent<HTMLInputElement>) =>
	{
		e.preventDefault();
		e.stopPropagation();

		const {dataTransfer} = e;
		const files = dataTransfer.files;

		if (files.length)
		{
			var file = files[0];
			if (validateImage(file))
			{
				const url = URL.createObjectURL(file);
				dispatch(switchTileset(url));

				const image = assetRef.current;
				if (image)
				{
					image.src = url;
				}
			}
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
	{
		console.log(e);
	}

	return (
		<div className="panel">
			<div className="header">Tileset</div>
			<div className="content">
				<Toolbar />
				<div className="tileset" style={{height: "50vh"}}>
					{selection.selected ? <div className='selection' style={{left:`${selection.xPos}px`, top:`${selection.yPos}px`}}></div> : null}
					<img ref={assetRef} onClick={handleOnClick}/>
					<input
						type={"file"}
						id="tileset-input"
						name="tileset"
						ref={inputRef}
						onDragOver={handleDragOver}
						onDrop={handleDrop}
						onChange={handleChange}/>
				</div>
			</div>
		</div> 
	)
}

export default TilesetPanel;