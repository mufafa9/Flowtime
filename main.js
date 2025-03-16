const { app, BrowserWindow, Menu, Tray } = require('electron');
const path = require('node:path');

let tray = null;
let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true, // Hides the menu bar
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  win.loadFile('index.html');

  // Hide window instead of closing
  win.on('close', (event) => {
    event.preventDefault();
    win.hide();
  });
}

app.whenReady().then(() => {
  createWindow();

  // Create system tray icon
  tray = new Tray(path.join(__dirname, 'icon.png')); // Change to your icon path
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => win.show() },
    { label: 'Quit', click: () => { app.quit(); } }
  ]);

  tray.setToolTip('Flowtime Timer');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => win.show()); // Show window on tray icon click

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
