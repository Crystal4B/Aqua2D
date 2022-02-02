import LevelRenderer from './Components/Editor/LevelRenderer';
import Sidebar from './Components/Sidebar/Sidebar';
import TilesetModule from './Components/Sidebar/Modules/TilesetModule';
import LevelsModule from './Components/Sidebar/Modules/LevelsModule';
import PropertiesModule from './Components/Sidebar/Modules/PropertiesModule';
import './App.css';

function App()
{
	return (
		<div className='rowC'>
			<Sidebar left={true}>
				<PropertiesModule />
			</Sidebar>
			<LevelRenderer />
			<Sidebar left={false}>
				<LevelsModule />
				<TilesetModule />
			</Sidebar>
		</div>
	);
}

export default App;
