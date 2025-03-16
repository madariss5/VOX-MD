const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs").promises;
const path = require("path");

module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    try {
        if (!text) return m.reply("What song do you want to download?");

        // Step 1: Search YouTube
        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return m.reply("No songs found!");
        }

        const urlYt = videos[0].url;
        console.log(`YouTube URL: ${urlYt}`);

        // Step 2: Get MP3 Download Link
        const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(urlYt)}&quality=128kbps`;
        console.log(`API URL: ${apiUrl}`);

        let data;
        try {
            data = await fetchJson(apiUrl);
            console.log("API Response:", data);
        } catch (error) {
            console.error("API Fetch Error:", error.message);
            return m.reply("Failed to connect to the download server.");
        }

        if (!data || data.status !== 200 || !data.result || !data.result.url) {
            console.error("Invalid API response:", data);
            return m.reply("Error: Failed to retrieve a valid audio file.");
        }

        const { title, url: audioUrl } = data.result;
        console.log(`Downloading: ${title} from ${audioUrl}`);

        const sanitizedTitle = title.replace(/[\/\\:*?"<>|]/g, "");
        const filePath = path.join(__dirname, `${sanitizedTitle}.mp3`);

        await m.reply(`_Downloading ${title}_ 🎶`);

        // Step 3: Download MP3 File
        try {
            const response = await axios.get(audioUrl, { responseType: "arraybuffer" });

            if (response.status !== 200 || response.data.length < 10000) {
                console.error("Download failed. File too small.");
                return m.reply("Download failed: Invalid audio file.");
            }

            await fs.writeFile(filePath, Buffer.from(response.data));
            console.log(`File saved: ${filePath}`);
        } catch (error) {
            console.error("Download Error:", error.message);
            return m.reply("Download failed: Unable to retrieve the audio file.");
        }

        // Step 4: Send MP3 File
        try {
            await client.sendMessage(
                m.chat,
                {
                    audio: await fs.readFile(filePath),
                    mimetype: "audio/mp3",
                    fileName: `${sanitizedTitle}.mp3`,
                },
                { quoted: m }
            );
            console.log(`Sent file: ${sanitizedTitle}.mp3`);
        } catch (error) {
            console.error("Send Error:", error.message);
            return m.reply("Error sending the file.");
        }

        // Step 5: Delete File After Sending
        try {
            await fs.unlink(filePath);
            console.log(`Deleted file: ${filePath}`);
        } catch (error) {
            console.error("File Delete Error:", error.message);
        }
    } catch (error) {
        console.error("General Error:", error.message);
        m.reply("Download failed: " + error.message);
    }
};