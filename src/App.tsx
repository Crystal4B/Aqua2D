import LevelRenderer from './Components/Editor/LevelRenderer';
import Sidebar from './Components/Sidebar/Sidebar';
import PropertiesPanel from './Components/Sidebar/Modules/PropertiesPanel/PropertiesPanel';
import TilesetPanel from './Components/Sidebar/Modules/TilesetPanel/TilesetPanel';
import LevelsPanel from './Components/Sidebar/Modules/LevelsPanel/LevelsPanel';
import Menu from './Components/Menu/Menu';
import './App.css';

const App = () =>
{
	return (
		<>
			<div className='rowC'>
				<Sidebar left={true}>
					<PropertiesPanel />
				</Sidebar>
				<LevelRenderer />
				<Sidebar left={false}>
					<LevelsPanel />
					<TilesetPanel />
				</Sidebar>
			</div>
			<Menu />
		</>
	);
}

export default App;
