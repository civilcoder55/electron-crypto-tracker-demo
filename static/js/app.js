let CRYPTOCOMPARE_API_URI = "https://min-api.cryptocompare.com";
let UPDATE_INTERVAL = 120 * 1000;

let app = new Vue({
  el: "#app",
  data: {
    coins: {},
    CRYPTOCOMPARE_URI: "https://www.cryptocompare.com",
    time: "",
    refresh: 0,
  },
  methods: {
    getCoins: function () {
      axios
        .get(CRYPTOCOMPARE_API_URI + "/data/top/mktcapfull?limit=10&tsym=USD")
        .then((resp) => {
          this.coins = resp.data.Data;
        })
        .catch((err) => {
          console.error(err);
        });
      this.refresh = UPDATE_INTERVAL / 1000;
    },

    getColor: (num) => {
      if (num == 0) {
        return "color:gray;";
      }
      return num > 0 ? "color:green;" : "color:red;";
    },
    getTime: function () {
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

      this.time = time;
      setTimeout(this.getTime, 1000);
    },
  },

  created: function () {
    this.getTime();
    this.getCoins();
  },
});

setInterval(() => {
  app.getCoins();
}, UPDATE_INTERVAL);

setInterval(() => --app.refresh, 1000);
