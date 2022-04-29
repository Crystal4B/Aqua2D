import "./Tabs.css"
import { ReactElement, useState } from "react"

type Props = {
	children: ReactElement[]
}

/**
 * Simple tabs component
 * @returns JSX implementation of numerous tabs
 */
const Tabs: React.FC<Props> = ({children}) =>
{
	const [selectedTab, setSelectedTab] = useState(0);

	const updateSelection = (index: number) =>
	{
		setSelectedTab(index);
	}

	return (
		<div>
			<ul className="header horizontal-list">
				{children.map((item, index) => (
					<li key={index}>
						<button className="tab-button" onClick={() => updateSelection(index)}>{item.props.title}</button>
					</li>
				))}
			</ul>
			{children[selectedTab]}
		</div>
	)
}

export default Tabs;