const axios = require("axios");
const fs = require("fs");
const path = require("path");
const yts = require("yt-search");

module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    try {
        if (!text) return m.reply("What song do you want to download?");
        
        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return m.reply("No songs found!");
        }

        const urlYt = videos[0].url;

        try {
            let data = await fetchJson(`https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(urlYt)}&quality=128kbps`);

            if (!data || !data.result || !data.result.url) {
                return m.reply("Error: Failed to retrieve a valid audio file.");
            }

            const { title, url: audioUrl } = data.result;
            const filePath = path.join(__dirname, `${title}.mp3`);

            await m.reply(`_Downloading ${title}_ 🎶`);

            // Download MP3 and save it locally
            const response = await axios({ url: audioUrl, responseType: "arraybuffer" });
            fs.writeFileSync(filePath, response.data);

            // Send audio file
            await client.sendMessage(
                m.chat,
                {
                    audio: fs.readFileSync(filePath),
                    mimetype: "audio/mpeg",
                    fileName: `${title}.mp3`,
                },
                { quoted: m }
            );

            // Delete file after sending
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error("API request failed:", error.message);
            m.reply("Download failed: Unable to retrieve audio.");
        }
    } catch (error) {
        m.reply("Download failed\n" + error.message);
    }
};