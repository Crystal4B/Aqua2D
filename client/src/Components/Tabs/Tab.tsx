type Props = {
	title: string
}

/**
 * Simple tab component
 * @returns jsx implementation of a tab
 */
const Tab: React.FC<Props> = ({children}) =>
{
	return (
		<div>
			{children}
		</div>
	);
}

export default Tab;