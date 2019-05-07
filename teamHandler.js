const teamDebug = require("debug")("app:team")
const play = require("./player")

class teamHandler {
    constructor() {
        this.teamOne = [];
        this.teamTwo = [];
    }
    addPlayer(player) {
        if (player.index < 5) {
            this.teamOne.push({ player })
        }
        else {
            this.teamTwo.push({ player })
        }
    }
    getTeamAverages(teamNum) {
        let awlr = 0;
        let akdr = 0;
        let alevel = 0;
        if (teamNum === 1) {
            for (let i = 0; i < this.teamOne.length; i++) {
                awlr = awlr + this.teamOne[i].player.wlr;
                akdr = akdr + this.teamOne[i].player.kdr;
                alevel = alevel + this.teamOne[i].player.level;
            }
            awlr = awlr / this.teamOne.length;
            akdr = akdr / this.teamOne.length;
            alevel = alevel / this.teamOne.length;
        }
        else if (teamNum === 2) {
            for (let i = 0; i < this.teamTwo.length; i++) {
                awlr = awlr + this.teamTwo[i].player.wlr;
                akdr = akdr + this.teamTwo[i].player.kdr;
                alevel = alevel + this.teamTwo[i].player.level;
            }
            awlr = awlr / this.teamTwo.length;
            akdr = akdr / this.teamTwo.length;
            alevel = alevel / this.teamTwo.length;
        }
        console.log("GTA: T:", teamNum, " WL: ", awlr, " KD: ", akdr, " level:", alevel)
        return { awlr, akdr, alevel };
    }

    printAverages() {
        let teamOneAvg = this.getTeamAverages(1);
        console.log("teamOneAvg: Win/Loss: ", teamOneAvg.awlr, " Kill/Death: ", teamOneAvg.akdr, " Level: ", teamOneAvg.alevel);
        let teamTwoAvg = this.getTeamAverages(2);
        console.log("teamTwoAvg: Win/Loss: ", teamTwoAvg.awlr, " Kill/Death: ", teamTwoAvg.akdr, " Level: ", teamTwoAvg.alevel);
    }
}


module.exports = teamHandler;