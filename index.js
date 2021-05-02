const { ipcRenderer } = require("electron");


function closeApp() {
  ipcRenderer.send("closeApp");
}


function minimizeApp() {
  ipcRenderer.send("minimizeApp");
}


module.exports = { closeApp, minimizeApp, focus };
