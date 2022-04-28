import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateObject } from "../../../../Redux/Levels/Tilemap/tilemapActions";
import { objectState } from "../../../../Redux/Levels/Tilemap/tilemapReducer";
import { rootState } from "../../../../Redux/store";
import Card from "./Card";

interface ObjectProperiesProps
{
	focusedId: string
}

const ObjectProperies: React.FC<ObjectProperiesProps> = ({focusedId}) =>
{
	const selectedSceneId = useSelector<rootState, string>(state => state.levels.scenes.byId[state.levels.levels.selectedId].selectedId);
	const selectedLayerId = useSelector<rootState, string>(state => state.levels.layers.byId[selectedSceneId].selectedId);
	const object = useSelector<rootState, objectState>(state => state.levels.tilemaps.byId[selectedSceneId].data[selectedLayerId].objects[+focusedId])
	const dispatch = useDispatch();

	const handleNameChange = (event: React.ChangeEvent) =>
	{
		let value = (event.target as HTMLInputElement).value;

		dispatch(updateObject(selectedSceneId, selectedLayerId, +focusedId, {...object, name: value}));
	}

	const handlePositionChange = (event: React.ChangeEvent) =>
	{
		let name = (event.target as HTMLInputElement).name;
		let value = (event.target as HTMLInputElement).value;

		dispatch(updateObject(selectedSceneId, selectedLayerId, +focusedId, {...object, [name]: value}));
	}

	const handleControlChange = (event: React.ChangeEvent) =>
	{
		let name = (event.target as HTMLInputElement).name;
		let value = (event.target as HTMLInputElement).value;
		let originalValue;

		let controls = object.controller.control
		if (!('up' in controls))
			return;

		switch(name)
		{
		case 'up':
			originalValue = controls.up;
			break;
		case 'down':
			originalValue = controls.down;
			break;
		case 'left':
			originalValue = controls.left;
			break;
		case 'right':
			originalValue = controls.right;
			break;
		default:
			originalValue = controls.attack
		}

		for (let i = 0; i < value.length; i++)
		{
			if (value[i] === originalValue[0])
			{
				value = value.substring(0, i) + value.substring(i+1, value.length);
			}
		}

		dispatch(updateObject(selectedSceneId, selectedLayerId, +focusedId, {...object, controller: {...object.controller, control: {...object.controller.control, [name]: value}}}));
	}

	return (
		<>
			<Card title="Common">
					<label htmlFor="name">Name:</label>
					<input name="name" type="text" value={object.name} onChange={handleNameChange}/>
				</Card>
				<hr className="rounded"/>
				<Card title="Positioning">
					<label htmlFor="x">X:</label>
					<input name="x" type={"number"} value={object.x} onChange={handlePositionChange}/>
					<br/>
					<label htmlFor="y">Y:</label>
					<input name="y" type={"number"} value={object.y} onChange={handlePositionChange}/>
					<br/>
					<label htmlFor="width">Width:</label>
					<input name="width" type={"number"} value={object.width} onChange={handlePositionChange}/>
					<br/>
					<label htmlFor="height">Height:</label>
					<input name="height" type={"number"} value={object.height} onChange={handlePositionChange}/>
				</Card>
				<hr className="rounded"/>
				<Card title="Behaviour">
					<label htmlFor="type">Type:</label>
					<select name="type"
							value={object.controller.type}
							onChange={(event) => {
								dispatch(updateObject(selectedSceneId, selectedLayerId, +focusedId, {...object, controller: {...object.controller, type: event.target.value}}));
							}}
						>
						<option value='player'>Player</option>
						<option value='npc'>NPC</option>
					</select>
					<br/>
					{object.controller.type === 'player' && 'up' in object.controller.control ?
						(<>
							<label htmlFor="up">Up:</label>
							<input name="up" type="text" value={object.controller.control.up} onChange={handleControlChange}/>
							<br/>
							<label htmlFor="down">Down:</label>
							<input name="down" type="text" value={object.controller.control.down} onChange={handleControlChange}/>
							<br/>
							<label htmlFor="left">Left:</label>
							<input name="left" type="text" value={object.controller.control.left} onChange={handleControlChange}/>
							<br/>
							<label htmlFor="right">Right:</label>
							<input name="right" type="text" value={object.controller.control.right} onChange={handleControlChange}/>
							<br/>
							<label htmlFor="attack">Attack:</label>
							<input name="attack" type="text" value={object.controller.control.attack} onChange={handleControlChange}/>
							<br/>
						</>)
					:
						(<>
							<p>
								This needs more work
							</p>
						</>)
					}
				</Card>
		</>
	)
}

export default ObjectProperies;