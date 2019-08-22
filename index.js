const Discord = require("discord.js");
const client = new Discord.Client();
const run = require("./imagePros");

let lastChannel;
let isWorking;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
  try {
    if (!msg.author.bot) {
      if (msg.content.includes("#stats")) {
        if (!isWorking) {
          try {
            lastChannel = msg.channel;
            console.log(msg.attachments.first().url);
            image = downloadImage(
              msg.attachments.first().url,
              "./download/working.png"
            );
          } catch (err) {
            msg.reply("stop trying to break my bot");
          }
        } else {
          msg.reply("bot is busy");
        }
      } else if (msg.content.includes("flavortown")) {
        msg.reply(
          "https://www.urbandictionary.com/define.php?term=Flavor%20Town"
        );
      }
    }
  } catch (err) {
    console.log(err.name, " : ", err.message);
  }
});

function sendMessage(message) {
  lastChannel.send(message);
}

client.login("DISCORD BOT CODE");

const download = require("image-downloader");

function downloadImage(url, localPath) {
  const options = {
    url: url,
    dest: localPath
  };
  download
    .image(options)
    .then(({ filename, image }) => {
      console.log("File Saved To", filename);
      starWork();
      run.Run(filename);
    })
    .catch(err => {
      stopWork();
      console.error(err);
    });
}
function starWork() {
  isWorking = true;
}
function stopWork() {
  isWorking = false;
}

module.exports.sendMessage = sendMessage;
module.exports.stopWork = stopWork;
