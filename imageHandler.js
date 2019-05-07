var Caman = require("caman").Caman;
const camanDebug = require("debug")("app:caman");
const nameLocs = [300, 355, 410, 465, 520, 605, 660, 715, 770, 825];
const nameLeftLoc = 470; //pixels
const nameHeight = 55; //pixels
const nameWidth = 300; //pixels
let renders = 0;
let numberOfPlayers;

class imageHandler {

    constructor(playersPerMatch) {
        numberOfPlayers = playersPerMatch;
    }

    processImages(path, callback) {
        for (let i = 0; i < numberOfPlayers; i++) {
            Caman(path, async function () {
                {
                    await this.crop(nameWidth, nameHeight, nameLeftLoc, nameLocs[i]);
                    const newWidth = nameWidth * 10;
                    const newHeight = nameHeight * 10;
                    await this.resize({
                        width: newWidth,
                        height: newHeight
                    });
                    await this.contrast(100);
                    await this.greyscale();
                    await this.invert();
                }

                await this.render(async function () {
                    await this.save(`./outputs/name${i}.png`);
                    renders++;
                    if (renders === numberOfPlayers) {
                        renders = 0;
                        callback();
                    }
                });
            });
        }
    }
}

Caman.Event.listen("processStart", function (job) {
    camanDebug("Start", job.name);
});
Caman.Event.listen("processComplete", function (job) {
    camanDebug("Complete", job.name);
});
Caman.Event.listen("renderFinished", function () {
    camanDebug("RenderFinished");
});

module.exports = imageHandler;