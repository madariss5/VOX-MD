const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs").promises;
const path = require("path");

module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    try {
        if (!text) return m.reply("What song do you want to download?");

        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return m.reply("No songs found!");
        }

        const urlYt = videos[0].url;
        console.log(`YouTube URL: ${urlYt}`);

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
            return m.reply("Error: Failed to retrieve a valid audio file.");
        }

        const { title, url: audioUrl } = data.result;
        console.log(`Downloading: ${title} from ${audioUrl}`);

        const sanitizedTitle = title.replace(/[\/\\:*?"<>|]/g, "");
        const filePath = path.join(__dirname, `${sanitizedTitle}.mp3`);

        await m.reply(`_Downloading ${title}_ 🎶`);

        try {
            const response = await axios.get(audioUrl, { responseType: "arraybuffer" });

            if (response.status !== 200 || response.data.length < 10000) {
                return m.reply("Download failed: Invalid audio file.");
            }

            const fileSize = Buffer.byteLength(response.data) / (1024 * 1024);
            if (fileSize > 5) {
                return m.reply("The file is too large to send on WhatsApp (Max 5MB).");
            }

            await fs.writeFile(filePath, Buffer.from(response.data));
            console.log(`File saved: ${filePath}`);
        } catch (error) {
            console.error("Download Error:", error.message);
            return m.reply("Download failed: Unable to retrieve the audio file.");
        }

        try {
            await client.sendMessage(
                m.chat,
                {
                    audio: await fs.readFile(filePath),
                    mimetype: "audio/mp4",
                    fileName: `${sanitizedTitle}.mp3`,
                },
                { quoted: m }
            );
            console.log(`Sent file: ${sanitizedTitle}.mp3`);
        } catch (error) {
            console.error("Send Error:", error.message);
            return m.reply("Error sending the file.");
        }

        setTimeout(async () => {
            try {
                await fs.unlink(filePath);
                console.log(`Deleted file: ${filePath}`);
            } catch (error) {
                console.error("File Delete Error:", error.message);
            }
        }, 5000);
    } catch (error) {
        console.error("General Error:", error.message);
        m.reply("Download failed: " + error.message);
    }
};