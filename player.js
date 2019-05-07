class player {

    constructor(name, wlr, kdr, level, index) {
        this.name = name;
        this.wlr = wlr;
        this.kdr = kdr;
        this.level = level;
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

    getLevel() {
        return this.level;
    }

    getTeam() {
        return this.team;
    }
}

module.exports = player;