'use strict';
const electron = require('electron');
const app = electron.app;
const path = require('path')

// adds debug features like hotkeys for triggering dev tools and reload
// require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	let lastWindowState = {}
	const win = new electron.BrowserWindow({
		title: app.getName(),
		show: true,
		x: lastWindowState.x | 0,
		y: lastWindowState.y | 0,
		width: lastWindowState.width | 200,
		height: lastWindowState.height | 200,
		icon: process.platform === 'linux' && path.join(__dirname, 'static/Icon.png'),
		minWidth: 400,
		minHeight: 200,
		titleBarStyle: 'hidden-inset',
		webPreferences: {
			// fails without this because of CommonJS script detection
			nodeIntegration: false,
			preload: path.join(__dirname, 'browser.js'),
			// required for Facebook active ping thingy
			webSecurity: false,
			plugins: true
		}
	});

	win.loadURL(`https://www.evernote.com/Home.action`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});
