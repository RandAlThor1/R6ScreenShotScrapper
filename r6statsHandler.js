const teamHandler = require("./teamHandler");
const statsDebug = require("debug")("app:stats");
const TH = new teamHandler();
const user = require("./player");

const https = require("https");
const rp = require("request-promise");

let recived = 0;

const gen = "generic";
const seas = "seasonal";
const ops = "operators";
const wepCat = "weapon-catagories";
const wep = "wepons";

function ServiceResponseError(message) {
  this.name = "ServiceResponseError";
  this.message = message || "";
}
ServiceResponseError.prototype = Error.prototype;

class r6statsHandler {
  constructor() {
    this.authenticating = true;
    client = new R6Stats({
      username: "*********",
      password: "***********",
      user_agent: "R6Stats Node API Test Application"
    });
  }

  getOtherStats(username) {
    return this.req(username, gen)
      .then(res => {
        return Promise.resolve(res);
      })
      .catch(err => {
        throw new ServiceResponseError(err);
      });
  }

  async getPlayer(username) {
    try {
      let genStats = await this.getOtherStats(username);
      let eloStats = await this.getplayerElo(username);
      let player = {
        username: genStats.username,
        wlr: genStats.stats.queue.ranked.wl,
        kdr: genStats.stats.queue.ranked.kd,
        level: genStats.progression.level,
        elo: eloStats.seasons.burnt_horizon.regions.ncsa[0].mmr
      };
      return player;
    } catch (err) {
      throw new ServiceResponseError(err);
    }
  }

  req(username, type) {
    const url = `https://api2.r6stats.com/public-api/stats/${username}/pc/${type}`;
    var defaults = {
      method: "GET",
      json: true,
      url: url,
      headers: {
        Authorization: "9d481f24-292e-478f-895a-34cff29736d4"
      }
    };
    var options = Object.assign({}, defaults);

    return rp(options);
  }

  getplayerId(num, names) {
    this.getPlayer(names[num])
      .then(function(player) {
        //statsDebug(player.username, ": getPlayerId")
        statsDebug(player.username, " : ", names[num]);
        // statsDebug("debug: ", player.username, " : ", player.stats.ranked.wlr, " : ", player.stats.ranked.kd, " : ", player.stats.progression.level, " : ", num)
        statsDebug(
          player.username,
          ": ",
          player.wlr,
          ": ",
          player.kdr,
          ": ",
          player.level,
          ": ",
          player.elo,
          ": ",
          num
        );
        TH.addPlayer(
          new user(
            player.username,
            player.wlr,
            player.kdr,
            player.level,
            player.elo,
            num
          )
        );
        recived++;
      })
      .catch(error => {
        if (error.name === "ServiceResponseError") {
          recived++;
          statsDebug("could not find : ", names[num]);
        } else {
          recived++;
          statsDebug(error.message, " : ", error.name);
        }
      })
      .then(() => {
        if (recived === 10) {
          recived = 0;
          this.printStats();
        }
      });
    if (recived === 10) {
      recived = 0;
      console.log("10: ", num);
      this.printStats();
    }
  }

  printStats() {
    TH.printAverages();
  }
}

module.exports = r6statsHandler;
