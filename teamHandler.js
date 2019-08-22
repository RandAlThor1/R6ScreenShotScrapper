const teamDebug = require("debug")("app:team");
const play = require("./player");
const output = require("./index");

class teamHandler {
    constructor() {
        this.teamOne = [];
        this.teamTwo = [];
    }
    addPlayer(player) {
        if (player.index < 5) {
            this.teamOne.push({ player });
        }
        else {
            this.teamTwo.push({ player });
        }
    }
    getTeamAverages(teamNum) {
        let awlr = 0;
        let akdr = 0;
        let alevel = 0;
        let aelo = 0;
        if (teamNum === 1) {
            for (let i = 0; i < this.teamOne.length; i++) {
                awlr = awlr + this.teamOne[i].player.wlr;
                akdr = akdr + this.teamOne[i].player.kdr;
                alevel = alevel + this.teamOne[i].player.level;
                aelo = aelo + this.teamOne[i].player.elo;
            }
            awlr = awlr / this.teamOne.length;
            akdr = akdr / this.teamOne.length;
            alevel = alevel / this.teamOne.length;
            aelo = aelo / this.teamOne.length;
        }
        else if (teamNum === 2) {
            for (let i = 0; i < this.teamTwo.length; i++) {
                awlr = awlr + this.teamTwo[i].player.wlr;
                akdr = akdr + this.teamTwo[i].player.kdr;
                alevel = alevel + this.teamTwo[i].player.level;
                aelo = aelo + this.teamTwo[i].player.elo;
            }
            awlr = awlr / this.teamTwo.length;
            akdr = akdr / this.teamTwo.length;
            alevel = alevel / this.teamTwo.length;
            aelo = aelo / this.teamTwo.length;
        }
        awlr = Math.round(awlr * 100) / 100;
        akdr = Math.round(akdr * 100) / 100;
        alevel = Math.round(alevel * 100) / 100;
        aelo = Math.round(aelo * 100) / 100;
        return { awlr, akdr, alevel, aelo };
    }

    printAverages() {
        let teamOneAvg = this.getTeamAverages(1);
        output.sendMessage(`TeamOneAvg: Win/Loss:${teamOneAvg.awlr}  Kill/Death:${teamOneAvg.akdr}  Level:${teamOneAvg.alevel}  MMR/ELO: ${teamOneAvg.aelo}`);
        let teamTwoAvg = this.getTeamAverages(2);
        output.sendMessage(`TeamTwoAvg: Win/Loss:${teamTwoAvg.awlr}  Kill/Death:${teamTwoAvg.akdr}  Level:${teamTwoAvg.alevel}  MMR/ELO: ${teamTwoAvg.aelo}`);
        output.stopWork();
    }
}


module.exports = teamHandler;