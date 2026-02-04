const { createCanvas, loadImage } = require("canvas");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "latti",
    aliases: ["lathi"],
    version: "1.2",
    author: "eden",
    countDown: 5,
    role: 0,
    shortDescription: "Football kick edit",
    longDescription: "Adds your profile pic and target's profile pic into a football kick meme",
    category: "fun",
    guide: {
      en: "{p}{n} @mention / reply"
    }
  },

  onStart: async function({ api, args, message, event, usersData }) 
    try {
      let targetID;
      if (Object.keys(event.mentions).length > 0) {
        targetID = Object.keys(event.mentions)[0];
      } else if (event.messageReply) {
        targetID = event.messageReply.senderID;
      } else {
        return api.sendMessage("- কাকে ফুটবল এর মতো কিক মারবি মেনশন দে..!", event.threadID, event.messageID);
      }

      const senderID = event.senderID;

      const senderAvatar = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const targetAvatar = `https://graph.facebook.com/${targetID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      const templatePath = path.join(__dirname, "cache", "dkick_base.png");
      if (!fs.existsSync(templatePath)) {
        const imgUrl = "https://files.catbox.moe/4x39pb.jpg";
        const res = await axios.get(imgUrl, { responseType: "arraybuffer" });
        fs.outputFileSync(templatePath, res.data);
      }

      const baseImg = await loadImage(templatePath);
      const senderImg = await loadImage(senderAvatar);
      const targetImg = await loadImage(targetAvatar);

      const canvas = createCanvas(baseImg.width, baseImg.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

      // Sender face
      const senderY = 130;
      ctx.save();
      ctx.beginPath();
      ctx.arc(120, senderY + 45, 45, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(senderImg, 75, senderY, 90, 90);
      ctx.restore();

      // Target face
      const targetX = 260;
      const targetY = 25;
      const targetSize = 100;

      ctx.save();
      ctx.beginPath();
      ctx.arc(targetX + targetSize / 2, targetY + targetSize / 2, targetSize / 2, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(targetImg, targetX, targetY, targetSize, targetSize);
      ctx.restore();

      const outPath = path.join(__dirname, "cache", `dkick_${event.senderID}.png`);
      fs.writeFileSync(outPath, canvas.toBuffer());

      api.sendMessage(
        { body: "- Bombolaaa 🦵⚽", attachment: fs.createReadStream(outPath) },
        event.threadID,
        () => fs.unlinkSync(outPath),
        event.messageID
      );
    } catch (e) {
      console.error(e);
      return api.sendMessage("❌ Error generating image.", event.threadID, event.messageID);
    }
  }
};
