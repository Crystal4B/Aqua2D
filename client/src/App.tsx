import './App.css';
import LevelRenderer from './Components/Editor/LevelRenderer';
import Sidebar from './Components/Sidebar/Sidebar';
import PropertiesPanel from './Components/Sidebar/Modules/PropertiesPanel/PropertiesPanel';
import LevelsPanel from './Components/Sidebar/Modules/LevelsPanel/LevelsPanel';
import Menu from './Components/Menu/Menu';
import ControlPanel from './Components/ControlPanel/ControlPanel';
import TabbedPanel from './Components/Sidebar/Modules/TabbedPanel/TabbedPanel';
import ObjectPanel from './Components/Sidebar/Modules/ObjectPanel/ObjectPanel';

/**
 * Central component defining the entire application
 * @returns the JSX implementation of the application
 */
const App = () =>
{
	return (
		<>
			<ControlPanel />
			<div className='rowC'>
				<Sidebar left={true}>
					<PropertiesPanel />
					<ObjectPanel />
				</Sidebar>
				<LevelRenderer />
				<Sidebar left={false}>
					<LevelsPanel />
					<TabbedPanel />
				</Sidebar>
			</div>
			<Menu />
		</>
	);
}

export default App;
