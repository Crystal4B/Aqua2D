import {app, BrowserWindow} from "electron";
import * as path from "path";

let mainWindow: Electron.BrowserWindow | null;

function createWindow()
{
	// Create our browser window
	mainWindow = new BrowserWindow({
		width: 800,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		}
	});

	// Load the index
	mainWindow.loadFile(path.join(__dirname, "index.html"));

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}

// Create window when the app is ready
app.on("ready", createWindow);

app.on("window-all-closed", () => {
	// on OS X it is common for applications to not quit on closure of window
	if (process.platform !== "darwin")
	{
		app.quit();
	}
})

app.on("activate", () => {
	// on OS X it is common to reconstruct windows when the icon is pressed
	if (mainWindow === null)
	{
		createWindow();
	}
})