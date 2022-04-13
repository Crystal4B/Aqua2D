import { useState } from "react";
import Card from "./Card";

interface ObjectProperiesProps
{
	focusedId: string
}

const ObjectProperies: React.FC<ObjectProperiesProps> = ({focusedId}) =>
{
	const [state, setState] = useState({
		name: 'name',
		x: 100,
		y: 100,
		width: 100,
		height: 100
	})

	const handleNameChange = (event: React.ChangeEvent) =>
	{
		let value = (event.target as HTMLInputElement).value;

		setState({...state, name: value});
	}

	const handlePositionChange = (event: React.ChangeEvent) =>
	{
		let name = (event.target as HTMLInputElement).name;
		let value = (event.target as HTMLInputElement).value;

		setState({...state, [name]: value})
	}

	return (
		<>
			<Card title="Common">
					<label htmlFor="name">Name:</label>
					<input name="name" type="text" value={state.name} onChange={handleNameChange}/>
				</Card>
				<hr className="rounded"/>
				<Card title="Positioning">
					<label htmlFor="x">X:</label>
					<input name="x" type={"number"} value={state.x} onChange={handlePositionChange}/>
					<br/>
					<label htmlFor="y">Y:</label>
					<input name="y" type={"number"} value={state.y} onChange={handlePositionChange}/>
					<br/>
					<label htmlFor="width">Width:</label>
					<input name="width" type={"number"} value={state.width} onChange={handlePositionChange}/>
					<br/>
					<label htmlFor="height">Height:</label>
					<input name="height" type={"number"} value={state.height} onChange={handlePositionChange}/>
				</Card>
				<hr className="rounded"/>
				<Card title="Behaviour">
					<p>
						This is where the behavioural settings live such as AI pathfinding and keybinds for players
					</p>
				</Card>
		</>
	)
}

export default ObjectProperies;