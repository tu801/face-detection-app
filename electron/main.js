require('dotenv').config();

const { app, BrowserWindow } = require('electron');
const path = require('path');

const appServe = app.isPackaged
  ? (async () => {
      const serve = await import('electron-serve');
      return serve.default({
        directory: path.join(__dirname, '../out'),
      });
    })()
  : null;

const createWindow = async () => {
  const win = new BrowserWindow({
    width: 1024,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true, // disable menu bar
  });

  if (app.isPackaged) {
    const serve = await appServe;
    serve(win).then(() => {
      win.loadURL('app://-');
    });
  } else {
    win.loadURL('http://localhost:3000');

    // open devtools in development mode
    if (process.env.NODE_ENV === 'development') {
      win.webContents.openDevTools();
    }

    win.webContents.on('did-fail-load', (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });
  }
};

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
