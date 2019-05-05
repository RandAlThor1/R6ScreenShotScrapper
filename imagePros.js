const Tesseract = require("tesseract.js");
var Caman = require("caman").Caman;

const camanDebug = require("debug")("app:caman");
const tessDebug = require("debug")("app:tess");
nameLocs = [300, 355, 410, 465, 520, 605, 660, 715, 770, 825];
names = [];
let renders = 0;
let namesCount = 0;

const playersPerMatch = 10;

this.Tesseract = Tesseract.create({
  workerPath: "Z:/r6bot/node_modules/tesseract.js/src/node/worker.js",
  langPath: "Z:/r6bot/depen/eng.traineddata",
  corePath: "Z:/r6bot/depen/tesseract.js-core-master/index.js"
});

function textInImage(num) {
  Tesseract.recognize(`./outputs/name${num}.png`, {
    lang: "eng",
    tessedit_char_blacklist: ":"
  })
    .catch(err => console.error(err))
    .then(result => {
      names[num] = result.text;
      tessDebug(names[num]);
      namesCount++;
      if (namesCount === playersPerMatch) {
        Tesseract.terminate();
        printNames();
      }
    });
}

function textInImageloop() {
  for (let i = 0; i < playersPerMatch; i++) {
    textInImage(i);
  }
}

Caman.Event.listen("processStart", function(job) {
  camanDebug("Start", job.name);
});
Caman.Event.listen("processComplete", function(job) {
  camanDebug("Complete", job.name);
});
Caman.Event.listen("renderFinished", function() {
  camanDebug("RenderFinished");
});

function getName(num, path) {
  const nameLeftLoc = 470; //pixels
  const nameHeight = 55; //pixels
  const nameWidth = 300; //pixels
  Caman(path, async function() {
    {
      await this.crop(nameWidth, nameHeight, nameLeftLoc, nameLocs[num]);
      const newWidth = nameWidth * 10;
      const newHeight = nameHeight * 10;
      await this.resize({
        width: newWidth,
        height: newHeight
      });
      await this.contrast(100);
      await this.invert();
    }

    await this.render(async function() {
      await this.save(`./outputs/name${num}.png`);
      renders++;
      if (renders === playersPerMatch) {
        textInImageloop();
      }
    });
  });
}
function run(path) {
  for (let i = 0; i < playersPerMatch; i++) {
    getName(i, path);
  }
}

function printNames() {
  for (let i = 0; i < names.length; i++) {
    names[i] = names[i].slice(0, names[i].length - 2);
  }
  console.log(names);
  for (let i = 0; i < names.length; i++) {
    getplayerId(i);
  }
}

function getUserId(num) {
  r5.profile(names[num], "uplay")
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.error(names[num], "COULD NOT FIND!");
    });
}

var team1KD = 0;
var team2KD = 0;

const R6Stats = require("r6stats");
const client = new R6Stats({
  username: "LordChanka",
  password: "IsTheGreatest",
  user_agent: "R6Stats Node API Test Application"
});
client.authenticate();
var players = new client.services.PlayerService(client);
function getplayerId(num) {
  players
    .getPlayer(names[num], "uplay")
    .then(function(player) {
      console.log(player.ubisoft_id, " : ", names[num]);
    })
    .catch(function(err) {
      console.error("COULD NOT FIND! : ", names[num]);
    });
}

function getStats(num) {
  R6.stats(names[num], false)
    .then(res => {
      console.log(res);
    })
    .catch(error => {
      console.error(names[num], "COULD NOT FIND!");
    });
}

const chokidar = require("chokidar");
const watcher = chokidar.watch(
  "C:/Users/Ben Allen/Pictures/Uplay/Tom Clancy's Rainbow Six® Siege/"
);

watcher
  .on("add", function(path) {
    setTimeout(() => {
      run(path);
    }, 1000);
  })
  .on("error", function(error) {
    console.error(error);
  });
