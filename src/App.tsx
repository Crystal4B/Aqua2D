import LevelRenderer from './Components/Editor/LevelRenderer';
import Sidebar from './Components/Sidebar/Sidebar';
import TilesetModule from './Components/Sidebar/Modules/TilesetModule';
import './App.css';

function App()
{
	return (
		<div className='rowC'>
			<Sidebar left={true}>
				<TilesetModule />
			</Sidebar>
			<LevelRenderer />
			<Sidebar left={false}>
				<TilesetModule />
			</Sidebar>
		</div>
	);
}

export default App;
