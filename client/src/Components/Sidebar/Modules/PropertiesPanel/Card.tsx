import { useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

/**
 * Interface representing the props requried by the Card
 */
interface cardProps
{
	title: string
}

/**
 * Card block storing a specific section of properties
 * @returns JSX implementation of a Card
 */
const Card: React.FC<cardProps> = ({title, children}) =>
{
	const [expand, setExpand] = useState(true);

	const changeExpand = () =>
	{
		setExpand(!expand);
	}

	return (
		<div className="card">
			<div className="card-header" onClick={changeExpand}>
				{title} {expand  ? <RiArrowDropUpLine /> : <RiArrowDropDownLine />}
			</div>
			{expand ?
				<div className="card-body">
					{children}
				</div>
			:
				null
			}
		</div>
	)
}

export default Card;