const { remote } = require("electron");
const Fs = require("fs");
const { promisify } = require("util");
const readFileAsync = promisify(Fs.readFile);
const writeFileAsync = promisify(Fs.writeFile);

//make app data folder if not exsist to store config file
Fs.mkdir(`${process.env["ProgramData"]}/Notifer`, { recursive: true }, (err) => {
  if (err) throw err;
});

//check for config file or create if not exist
if (!Fs.existsSync(`${process.env["ProgramData"]}/Notifer/settings.json`)) {
  saveSettings({
    favourite: {
      btc: true,
      ltc: false,
      "44.1900": false,
      eth: false,
    },
    notifications: false,
  });
}

//function to close app for x icon on title bar
function closeApp() {
  remote.app.quit();
}

//function to minimize app for square icon on title bar
function minimizeApp() {
  remote.BrowserWindow.getFocusedWindow().minimize();
}

//function to focus app to use it when click on app notification
function focus() {
  if (!remote.getCurrentWindow().isFocused()) {
    remote.getCurrentWindow().focus();
  }
}

// save user settings in config file
async function saveSettings(data) {
  const json = JSON.stringify(data, null, 2);

  try {
    await writeFileAsync(`${process.env["ProgramData"]}/Notifer/settings.json`, json);
  } catch (error) {
    console.error(error);
  }
}

// read user settings from config file
async function readSettings() {
  try {
    json = await readFileAsync(`${process.env["ProgramData"]}/Notifer/settings.json`, "utf8");
    const data = JSON.parse(json);
    return data;
  } catch (error) {
    console.error(error);
  }
}
// add currency to favourite //frontend stuff
async function addFav(currency) {
  settings = await readSettings();
  settings.favourite[currency] = true;
  saveSettings(settings);
  $(`#all-${currency}`).attr("class", "d-block text-uppercase badge badge-primary");
  $(`#all-${currency}`).text(`you added ${currency} to favourite`);
  $(`#all-${currency}`).removeAttr(`onclick`);
  $(`#all-${currency}`).attr("style", "pointer-events: none;");
  $("#favList").append(`<tr>
  <td class="max-width-100">
      <h4 class="text-truncate mb-0">${currency}</h4>
  </td>
  <td class="text-center"><span class="d-block badge badge-warning"
      id="${currency}">Loading...</span></td>
  <td class="text-center p-1">
      <a href="javascript:void(0)" id="fav-${currency}" onclick="removeFav('${currency}')" class="d-block text-uppercase badge badge-info">Remove ${currency} from Favourite</a> 
  </td>
</tr>`);
}

// remove currency from favourite //frontend stuff
async function removeFav(currency) {
  settings = await readSettings();
  settings.favourite[currency] = false;
  saveSettings(settings);
  $(`#fav-${currency}`).parent().parent().remove();
  $(`#all-${currency}`).attr("class", "d-block text-uppercase badge badge-light");
  $(`#all-${currency}`).text(`add ${currency} to favourite`);
  $(`#all-${currency}`).attr(`onclick`, `addFav('${currency}')`);
  $(`#all-${currency}`).removeAttr("style");
}
function showTime() {
  var date = new Date();
  var h = date.getHours(); // 0 - 23
  var m = date.getMinutes(); // 0 - 59
  var s = date.getSeconds(); // 0 - 59
  var y = date.getFullYear();
  var mn = date.getMonth() + 1;
  var d = date.getDate();
  var session = "AM";

  if (h == 0) {
    h = 12;
  }

  if (h > 12) {
    h = h - 12;
    session = "PM";
  }

  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;

  var time = y + "/" + mn + "/" + d + "      " + h + ":" + m + ":" + s + " " + session;

  $("#date").text(time);
  $("#date2").text(time);
  setTimeout(showTime, 1000);
}

async function setPrice(priceList) {
  Object.keys(priceList).forEach(function (key) {
    if (priceList[key] >= current[key]) {
      [...$(`*#${key}`)].forEach((element) => {
        $(element).attr("class", "d-block badge badge-success");
        $(element).text(priceList[key] + " $");
        current[key] = priceList[key];
      });
    } else {
      [...$(`*#${key}`)].forEach((element) => {
        $(element).attr("class", "d-block badge badge-danger");
        $(element).text(priceList[key] + " $");
        current[key] = priceList[key];
      });
    }
  });
}
async function getPrice() {
  response = await fetch("https://coincodex.com/apps/coincodex/cache/all_coins_packed.json?t=26465676&coincodex.com");
  json = await response.json();
  btc = parseFloat(json.data[0][5]).toFixed(2);
  ltc = parseFloat(json.data[8][5]).toFixed(2);
  eth = parseFloat(json.data[1][5]).toFixed(2);
  btcc = parseFloat(json.data[6][5]).toFixed(2);
  setPrice({ btc, ltc, eth, btcc });
}

module.exports = { closeApp, minimizeApp, focus, saveSettings, readSettings, addFav, removeFav, showTime, setPrice, getPrice };
