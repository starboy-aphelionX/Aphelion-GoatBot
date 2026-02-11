const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "sing",
    author: "Meheraz",
    category: "Youtube Song Downloader"
  },

  onStart: async function ({ api, args, message, event }) {
    try {
      const query = args.join(" ");
      if (!query) {
        return message.reply("❌ Please provide a song name!");
      }

      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      // 🔎 SEARCH SONG
      const searchResponse = await axios.get(
        `https://free-audio-api.onrender.com/search?q=${encodeURIComponent(query)}`
      );

      let videos = [];

      if (Array.isArray(searchResponse.data)) {
        videos = searchResponse.data;
      } else if (Array.isArray(searchResponse.data.data)) {
        videos = searchResponse.data.data;
      } else {
        return message.reply("⚠️ API response error!");
      }

      if (!videos.length) {
        return message.reply("❌ No results found!");
      }

      // ⏱ Duration Filter (under 10 min)
      const parseDuration = (timestamp) => {
        if (!timestamp) return 0;
        const parts = timestamp.split(":").map(Number);
        return parts.reduce((acc, val) => acc * 60 + val, 0);
      };

      const filteredVideos = videos.filter(video => {
        return parseDuration(video.timestamp) < 600;
      });

      if (!filteredVideos.length) {
        return message.reply("❌ No audio under 10 minutes found!");
      }

      const selectedVideo = filteredVideos[0];
      const videoId = selectedVideo.id || selectedVideo.videoId;

      if (!videoId) {
        return message.reply("⚠️ Invalid video ID!");
      }

      // 🎵 GET DOWNLOAD LINK
      const apiResponse = await axios.get(
        `https://free-audio-api.onrender.com/download?id=${videoId}`
      );

      const audioUrl =
        apiResponse.data.url || apiResponse.data.data?.url;

      if (!audioUrl) {
        throw new Error("Audio URL not found!");
      }

      // 🗂 Unique temp file
      const tempFilePath = path.join(
        __dirname,
        `temp_${Date.now()}.m4a`
      );

      const writer = fs.createWriteStream(tempFilePath);

      const audioResponse = await axios({
        url: audioUrl,
        method: "GET",
        responseType: "stream"
      });

      audioResponse.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      // 📦 File size check (25MB limit)
      const stats = fs.statSync(tempFilePath);
      const fileSizeInMB = stats.size / (1024 * 1024);

      if (fileSizeInMB > 25) {
        fs.unlinkSync(tempFilePath);
        return message.reply("❌ File too large to send (Over 25MB).");
      }

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await message.reply({
        body: `🎧 Now Playing:\n\n📌 ${selectedVideo.title}\n⏱ ${selectedVideo.timestamp}`,
        attachment: fs.createReadStream(tempFilePath)
      });

      fs.unlink(tempFilePath, () => {});

    } catch (error) {
      console.log(error);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      message.reply(`⚠️ Error: ${error.message}`);
    }
  }
};
