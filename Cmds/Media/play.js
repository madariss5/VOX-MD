const axios = require("axios");
const fs = require("fs").promises;
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

            // Download MP3 file
            const response = await axios({ url: audioUrl, responseType: "arraybuffer" });

            // Check if file is too small (indicating an error)
            if (response.data.length < 10000) {
                return m.reply("Download failed: The file is too small.");
            }

            // Save the file correctly
            await fs.writeFile(filePath, Buffer.from(response.data));

            // Send audio file
            await client.sendMessage(
                m.chat,
                {
                    audio: await fs.readFile(filePath),
                    mimetype: "audio/mp3",
                    fileName: `${title}.mp3`,
                },
                { quoted: m }
            );

            // Delete file after sending
            await fs.unlink(filePath);
        } catch (error) {
            console.error("API request failed:", error.message);
            m.reply("Download failed: Unable to retrieve audio.");
        }
    } catch (error) {
        m.reply("Download failed\n" + error.message);
    }
};