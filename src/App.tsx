import LevelRenderer from './Components/Editor/LevelRenderer';
import Sidebar from './Components/Sidebar/Sidebar';
import './App.css';

function App()
{
	return (
		<div className='rowC'>
			<Sidebar />
			<LevelRenderer />
		</div>
	);
}

export default App;
