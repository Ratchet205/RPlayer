const { app, BrowserWindow, screen } = require('electron');
const { globalShortcut } = require('electron/main');

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const win = new BrowserWindow({
        width: width,
        height: height,
        icon: 'public/img/ico/rplayer.ico',
        fullscreen: true,
        frame: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    win.loadFile('public/index.html')
    globalShortcut.register('CommandOrControl+Shift+H', () => {
        if (win) {
          if (win.isVisible()) {
            win.hide();
          } else {
            win.show();
          }
        }
      });

    win.loadFile('public/index.html')
    globalShortcut.register('CommandOrControl+Shift+Q', () => {
        if (win) {
          if (win.isVisible()) {
            app.exit();
          }
        }
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