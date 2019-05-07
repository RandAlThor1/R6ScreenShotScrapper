const playersPerMatch = 10; // only changed if for some reason we have more then 10 players per match!, locs would need updating, in imageHandler.js
const imageDebug = require("debug")("app:image")

const textRec = require("./textRecognition");
const Text = new textRec(playersPerMatch);
const imageHandler = require("./imageHandler");
const ImageHandler = new imageHandler(playersPerMatch);
const r6statsHandler = require("./r6statsHandler");
const R6 = new r6statsHandler();

function run(path) {
  if (!R6.getAuth()) {
    ImageHandler.processImages(path, () => {
      Text.textInImage(() => printNames(Text.names));
    });
  }
  else {
    imageDebug("Run waiting...");
    setTimeout(() => run(path), 3000);
  }
}


function getPlayerIdLoop() {
  for (let i = 0; i < Text.names.length; i++) {
    R6.getplayerId(i, Text.names);
  }
}

function printNames(names) {
  for (let i = 0; i < names.length; i++) {
    Text.names[i] = Text.names[i].slice(0, Text.names[i].length - 2);
    Text.names[i] = Text.names[i].replace(" ", "");
  }
  getPlayerIdLoop()
}

const chokidar = require("chokidar");
const watcher = chokidar.watch(
  "C:/Users/Ben Allen/Pictures/Uplay/Tom Clancy's Rainbow Six® Siege/"
);

watcher
  .on("add", function (path) {
    setTimeout(() => {
      run(path);
    }, 1000);
  })
  .on("error", function (error) {
    console.error(error);
  });
