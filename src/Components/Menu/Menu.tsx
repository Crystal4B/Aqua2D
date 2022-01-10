import './Menu.css';

interface IItem
{
	name: string;
	function: {(): void}
}

interface IMenuProps
{
	x: number;
	y: number;
	items: IItem[];
};

const Menu = ({x, y, items}: IMenuProps) => {
	return(
		<div id='contextMenu' className='context-menu' style={{top: y, left: x}}>
			<ul className='menu'>
				{items.map(item => {
					return <li className='button' onClick={item.function}>{item.name}</li>
				})}
			</ul>
		</div>
	);
};

export default Menu;