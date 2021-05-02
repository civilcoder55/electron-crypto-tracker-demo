const { app, BrowserWindow, ipcMain } = require("electron");

app.whenReady().then(() => {
  let win = new BrowserWindow({
    width: 939,
    height: 720,
    frame: false,
    show: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // win.webContents.openDevTools();
  win.once("ready-to-show", () => win.show());
  win.loadFile("index.html");
});

//EVENT LISTNERS
ipcMain.on("closeApp", (evt, arg) => app.quit());

ipcMain.on("minimizeApp", (evt, arg) => BrowserWindow.getFocusedWindow().minimize());
