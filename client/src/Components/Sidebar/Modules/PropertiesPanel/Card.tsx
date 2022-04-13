import { useState } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

interface cardProps
{
	title: string
}

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