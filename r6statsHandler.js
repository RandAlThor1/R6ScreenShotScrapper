const R6Stats = require("r6stats");
const teamHandler = require("./teamHandler")
const statsDebug = require("debug")("app:stats")
const TH = new teamHandler();
const user = require("./player")


let client;
let players;
let recived = 0;
class r6statsHandler {
    constructor() {
        this.authenticating = true;
        client = new R6Stats({
            username: "RandAlThor.HDW",
            password: "SunDried1!",
            user_agent: "R6Stats Node API Test Application"
        });
        //this.startAuth();
        this.authenticating = false;
        players = new client.services.PlayerService(client);
    }

    startAuth() {
        statsDebug("starting authentication...")
        this.authenticating = true;
        client.authenticate().catch(err => {
            statsDebug("authenticating complete");
            this.authenticating = false;
        });
    }

    getAuth() {
        return this.authenticating;
    }

    getplayerId(num, names) {
        if (!this.authenticating) {
            setTimeout(() => {
                players
                    .getPlayer(names[num], "uplay")
                    .then(function (player) {
                        console.log(recived, " :res's")
                        statsDebug(player.username, " : ", names[num]);
                        statsDebug("debug: ", player.username, " : ", player.stats.ranked.wlr, " : ", player.stats.ranked.kd, " : ", player.stats.progression.level, " : ", num)
                        TH.addPlayer(new user(player.username, player.stats.ranked.wlr, player.stats.ranked.kd, player.stats.progression.level, num));
                        recived++;
                    })
                    .catch((error) => {
                        if (error.name === "ServiceResponseError") {
                            recived++;
                            statsDebug("could not find : ", names[num])
                        }
                        else {
                            recived++;
                            statsDebug(error.message, " : ", error.name);
                        }
                    }).then(() => {
                        if (recived === 10) {
                            recived = 0;
                            console.log("10: ", num);
                            this.printStats();
                        }
                    });
                if (recived === 10) {
                    recived = 0;
                    console.log("10: ", num);
                    this.printStats();
                }
            }, (num * 2000));
        }
    }

    printStats() {
        TH.printAverages();
    }
}

module.exports = r6statsHandler;