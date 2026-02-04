const DIG = require("discord-image-generation");
const axios = require('axios');
const fs = require("fs");
const os = require("os");
const path = require("path");

module.exports = {
  config: {
    name: "kiss",
    aliases: ["kiss"],
    version: "0.0.1",
    author: "ArYAN",
    countDown: 5,
    role: 0,
    shortDescription: "kiss someone",
    longDescription: "Kisses a mentioned user by generating an image.",
    category: "fun",
    guide: "{pn} [@mention]"
  },
  onStart: async function({ api, args, message, event, usersData }) {
    const mention = Object.keys(event.mentions);
    if (mention.length === 0) {
      return message.reply("Please mention someone to kiss!");
    }

    const one = event.senderID;
    const two = mention[0];

    try {
      const pth = await makeKiss(one, two);
      await message.reply({
        body: "😘",
        attachment: fs.createReadStream(pth)
      });
      fs.unlinkSync(pth);
    } catch (e) {
      console.error(e);
      message.reply("An error occurred while creating the image.");
    }
  }
};

async function getAvatarBuffer(uid) {
  const url = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data, 'binary');
}

async function makeKiss(one, two) {
  const avatarOne = await getAvatarBuffer(one);
  const avatarTwo = await getAvatarBuffer(two);
  const img = await new DIG.Kiss().getImage(avatarOne, avatarTwo);
  const tmpDir = os.tmpdir();
  const pth = path.join(tmpDir, `kiss_${Date.now()}_${Math.floor(Math.random() * 10000)}.png`);
  fs.writeFileSync(pth, img);
  return pth;
}
