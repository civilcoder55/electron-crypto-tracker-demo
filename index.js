const { ipcRenderer } = require("electron");

//function to close app for x icon on title bar
function closeApp() {
  ipcRenderer.send("closeApp");
}

//function to minimize app for square icon on title bar
function minimizeApp() {
  ipcRenderer.send("minimizeApp");
  remote.BrowserWindow.getFocusedWindow().minimize();
}

//function to focus app to use it when click on app notification
function focus() {
  ipcRenderer.send("focus");
}

module.exports = { closeApp, minimizeApp, focus };
