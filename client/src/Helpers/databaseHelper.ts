import {Dexie, IndexableType, Table} from "dexie";

export interface Level
{
	id?: number;
	name: string;
	sceneIds?: number[];
}

export interface Scene
{
	id?: number;
	name: string;
	position: {
		x: number,
		y: number
	};
	size: {
		width: number,
		height: number
	};
	tileset: {
		tilesize: number,
		image?: URL;
	};
	layerIds?: number[];
}

export interface Layer
{
	id?: number;
	name: string;
	locked: boolean;
	hidden: boolean;
	tilemap?: Tile[][];
}

export interface Tile
{
	position: {x: number, y: number};
	rotation: number;
}

class Database extends Dexie
{
	levels!: Table<Level>;
	scenes!: Table<Scene>;
	layers!: Table<Layer>;

	constructor()
	{
		super('GameDatabase');
		this.version(1).stores({
			levels: '++id, name, sceneIds',
			scenes: '++id, name, position, size, tileset, layerIds',
			layers: '++id, name, locked, hidden, tilemap'
		});
	}
}

const database = new Database();
database.open();

export async function createLevel(level: Level)
{
	database.table("levels").add(level).then((id) => {
		// Create default scene
		createScene(id, {name: "Scene 1", position: {x: 300, y: 300}, size: {width: 10, height: 10}, tileset: {tilesize: 32}});
	});
}

export async function createScene(levelId: IndexableType, scene: Scene)
{
	database.table("scenes").put(scene).then((id) => {
		// Update parent level
		database.table("levels").update(levelId, {sceneIds: [id]}); // TOOD: figure out how to append to array
		// Create default layers
		createLayer(id, {name: "Collision", locked: false, hidden: false});
		createLayer(id, {name: "Layer 1", locked: false, hidden: false});
	});
}

export async function createLayer(sceneId: IndexableType, layer: Layer)
{
	database.table("layers").put(layer).then((id) => {
		// Update parent scene
		database.table("scenes").update(sceneId, {layerIds: [id]}); // TODO: figure out how to append to array
	});
}