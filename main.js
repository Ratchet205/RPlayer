const { app, BrowserWindow, screen } = require('electron');
const { globalShortcut } = require('electron/main');
const Store = require('electron-store');
const store = new Store();

function createWindow() {
  // Retrieve window state from the store or use default values
  const windowState = store.get('windowState', {
    width: screen.getPrimaryDisplay().workAreaSize.width,
    height: screen.getPrimaryDisplay().workAreaSize.height,
    frame: true,
    autoHideMenuBar: true,
    fullscreen: false,
    maximized: false, // New property to remember maximized state
  });

  const win = new BrowserWindow({
    width: windowState.width,
    height: windowState.height,
    fullscreen: false,
    frame: windowState.frame,
    autoHideMenuBar: windowState.autoHideMenuBar,
    icon: 'public/img/ico/rplayer.ico',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (windowState.maximized) {
    win.maximize();
  }

  win.loadFile('public/index.html');

  // Register global shortcuts
  globalShortcut.register('CommandOrControl+Shift+H', () => {
    if (win) {
      if (win.isVisible()) {
        win.hide();
      } else {
        win.show();
      }
    }
  });

  globalShortcut.register('CommandOrControl+Shift+Q', () => {
    if (win) {
      if (win.isVisible()) {
        app.exit();
      }
    }
  });

  // Save window state when the window is resized, moved, or maximized
  win.on('resize', () => {
    const { width, height } = win.getBounds();
    store.set('windowState', { ...windowState, width, height, maximized: win.isMaximized() });
  });

  win.on('move', () => {
    const { x, y } = win.getBounds();
    store.set('windowState', { ...windowState, x, y, maximized: win.isMaximized() });
  });

  win.on('maximize', () => {
    store.set('windowState', { ...windowState, maximized: true });
  });

  win.on('unmaximize', () => {
    store.set('windowState', { ...windowState, maximized: false });
  });

  win.on('closed', () => {
    app.quit(); // Quit the app when the window is closed
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
