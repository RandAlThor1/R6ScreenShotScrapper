const playersPerMatch = 10; // only changed if for some reason we have more then 10 players per match!, locs would need updating, in imageHandler.js


const textRec = require("./textRecognition");
const Text = new textRec(playersPerMatch);
const imageHandler = require("./imageHandler");
const ImageHandler = new imageHandler(playersPerMatch);



function run(path) {
  ImageHandler.processImages(path, () => {
    Text.textInImage(() => printNames(Text.names))
  })
}

function printNames(names) {
  for (let i = 0; i < names.length; i++) {
    Text.names[i] = Text.names[i].slice(0, Text.names[i].length - 2);
    Text.names[i] = Text.names[i].replace(" ", "");
  }
  for (let i = 0; i < Text.names.length; i++) {
    getplayerId(i);
  }
}
/*
function getUserId(num) {
  r5.profile(names[num], "uplay")
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.error(names[num], "COULD NOT FIND!");
    });
}
*/

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
    .getPlayer(Text.names[num], "uplay")
    .then(function (player) {
      console.log(player.ubisoft_id, " : ", Text.names[num]);
    })
    .catch(function (err) {
      console.error("COULD NOT FIND! : ", Text.names[num]);
    });
}

function getStats(num) {
  R6.stats(Text.names[num], false)
    .then(res => {
      console.log(res);
    })
    .catch(error => {
      console.error(Text.names[num], "COULD NOT FIND!");
    });
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
