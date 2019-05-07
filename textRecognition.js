const Tesseract = require("tesseract.js");
const tessDebug = require("debug")("app:tess");

class textRecognition {
    constructor(playersPerMatch) {
        this.playersPerMatch = playersPerMatch;
        this.namesCount = 0;
        this.names = [];
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
