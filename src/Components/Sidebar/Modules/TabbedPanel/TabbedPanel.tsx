import Tab from "../../../Tabs/Tab"
import Tabs from "../../../Tabs/Tabs"
import LayersPanel from "../LayersPanel/LayersPanel"
import TilesetPanel from "../TilesetPanel/TilesetPanel"

const TabbedPanel = () =>
{
	return (
		<div className="panel">
			<Tabs>
				<Tab title={"Tileset"}>
					<TilesetPanel />
				</Tab>
				<Tab title={"Layers"}>
					<LayersPanel />
				</Tab>
			</Tabs>
		</div>
	)
}

export default TabbedPanel;