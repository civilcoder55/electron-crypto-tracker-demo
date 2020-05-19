const { app, BrowserWindow } = require("electron");

function createWindow() {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 618,
    height: 480,
    frame: false,
    show: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  //win.webContents.openDevTools()
  win.once("ready-to-show", () => {
    win.show();
  });
  // and load the index.html of the app.
  win.loadFile("index.html");
}

app.whenReady().then(createWindow);
