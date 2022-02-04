import LevelRenderer from './Components/Editor/LevelRenderer';
import Sidebar from './Components/Sidebar/Sidebar';
import PropertiesPanel from './Components/Sidebar/Modules/PropertiesPanel/PropertiesPanel';
import TilesetPanel from './Components/Sidebar/Modules/TilesetPanel/TilesetPanel';
import LevelsPanel from './Components/Sidebar/Modules/LevelsPanel/LevelsPanel';
import './App.css';

function App()
{
	return (
		<div className='rowC'>
			<Sidebar left={true}>
				<PropertiesPanel />
			</Sidebar>
			<LevelRenderer />
			<Sidebar left={false}>
				<LevelsPanel levels={["Level 1", "Level 2"]} scenes={[["Scene 1", "Scene 2"],[]]}/>
				<TilesetPanel />
			</Sidebar>
		</div>
	);
}

export default App;
