const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs").promises;
const path = require("path");

module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    try {
        if (!text) return m.reply("What song do you want to download?");

        // Search for the song on YouTube
        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return m.reply("No songs found!");
        }

        const urlYt = videos[0].url;

        // Fetch MP3 download link from API
        const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(urlYt)}&quality=128kbps`;
        let data = await fetchJson(apiUrl);

        if (!data || data.status !== 200 || !data.result || !data.result.url) {
            return m.reply("Error: Failed to retrieve a valid audio file.");
        }

        const { title, url: audioUrl } = data.result;
        const sanitizedTitle = title.replace(/[\/\\:*?"<>|]/g, ""); // Remove invalid filename characters
        const filePath = path.join(__dirname, `${sanitizedTitle}.mp3`);

        await m.reply(`_Downloading ${title}_ 🎶`);

        // Download the MP3 file
        const response = await axios.get(audioUrl, { responseType: "arraybuffer" });

        if (response.status !== 200 || response.data.length < 10000) {
            return m.reply("Download failed: Invalid audio file.");
        }

        // Save the file
        await fs.writeFile(filePath, Buffer.from(response.data));

        // Send audio file
        await client.sendMessage(
            m.chat,
            {
                audio: await fs.readFile(filePath),
                mimetype: "audio/mp3",
                fileName: `${sanitizedTitle}.mp3`,
            },
            { quoted: m }
        );

        // Delete the file after sending
        await fs.unlink(filePath);
    } catch (error) {
        console.error("Error:", error.message);
        m.reply("Download failed: " + error.message);
    }
};