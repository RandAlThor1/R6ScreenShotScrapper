class player {

    constructor(name, wlr, kdr, level, elo, index) {
        this.name = name;
        this.wlr = wlr;
        this.kdr = kdr;
        this.level = level;
        this.elo = elo;
        this.index = index;
    }

    getName() {
        return this.name;
    }

    getWLR() {
        return this.wlr;
    }

    getKDR() {
        return this.kdr;
    }

    getElo() {
        return this.elo;
    }

    getLevel() {
        return this.level;
    }

    getTeam() {
        return this.team;
    }
}

module.exports = player;