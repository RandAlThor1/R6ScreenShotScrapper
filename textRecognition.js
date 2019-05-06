const Tesseract = require("tesseract.js");
const tessDebug = require("debug")("app:tess");

class textRecognition {
    constructor(playersPerMatch) {
        this.playersPerMatch = playersPerMatch;
        this.namesCount = 0;
        this.names = [];
        this.Tesseract = Tesseract.create({
            workerPath: "Z:/r6bot/node_modules/tesseract.js/src/node/worker.js",
            langPath: "Z:/r6bot/depen/eng.traineddata",
            corePath: "Z:/r6bot/depen/tesseract.js-core-master/index.js"
        });
    }
    textInImage(callback) {
        for (let i = 0; i < this.playersPerMatch; i++) {
            Tesseract.recognize(`./outputs/name${i}.png`, {
                lang: "eng",
                tessedit_char_blacklist: ":|"
            })
                .catch(err => console.error(err))
                .then(result => {
                    this.names[i] = result.text;
                    tessDebug(this.names[i]);
                    this.namesCount++;
                    if (this.namesCount === this.playersPerMatch) {
                        this.namesCount = 0;
                        Tesseract.terminate();
                        callback();
                    }
                });
        }
    }
}
module.exports = textRecognition;
