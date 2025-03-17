const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    try {
        if (!text) return m.reply("What song do you want to download?");

        // New API for YouTube search
        const searchUrl = `https://www.guruapi.tech/api/ytsearch?text=${encodeURIComponent(text)}`;
        console.log(`Search API URL: ${searchUrl}`);

        let searchData;
        try {
            searchData = await fetchJson(searchUrl);
            console.log("Search API Response:", searchData);
        } catch (error) {
            console.error("Search API Error:", error.message);
            return m.reply("Failed to connect to the search server.");
        }

        if (!searchData || !searchData.results || searchData.results.length === 0) {
            return m.reply("No songs found!");
        }

        const video = searchData.results[0];
        const urlYt = video.videoUrl;
        console.log(`YouTube URL: ${urlYt}`);

        // API for MP3 download
        let apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(urlYt)}&quality=128kbps`;
        console.log(`API URL: ${apiUrl}`);

        let data;
        try {
            data = await fetchJson(apiUrl);
            console.log("API Response:", data);
        } catch (error) {
            console.error("API Fetch Error:", error.message);
            return m.reply("Failed to connect to the download server.");
        }

        if (!data || !data.result || !data.result.url) {
            return m.reply("Error: Failed to retrieve a valid audio file.");
        }

        const { title, url: audioUrl } = data.result;
        console.log(`Downloading: ${title} from ${audioUrl}`);

        const sanitizedTitle = title.replace(/[\/\\:*?"<>|]/g, "");
        const filePath = path.join(__dirname, `${sanitizedTitle}.mp3`);

        await m.reply(`_Downloading ${title}_ 🎶`);

        try {
            const response = await axios.get(audioUrl, { responseType: "arraybuffer" });

            console.log(`Downloaded file size: ${response.data.length} bytes`);

            if (response.status !== 200 || response.data.length < 100000) {
                return m.reply("Download failed: Invalid or corrupted audio file.");
            }

            await fs.writeFile(filePath, Buffer.from(response.data));
            console.log(`File saved: ${filePath}`);

            await client.sendMessage(
                m.chat,
                {
                    audio: await fs.readFile(filePath),
                    mimetype: "audio/mpeg",
                    fileName: `${sanitizedTitle}.mp3`,
                },
                { quoted: m }
            );
            console.log(`Sent file: ${sanitizedTitle}.mp3`);

            setTimeout(async () => {
                try {
                    await fs.unlink(filePath);
                    console.log(`Deleted file: ${filePath}`);
                } catch (error) {
                    console.error("File Delete Error:", error.message);
                }
            }, 5000);
        } catch (error) {
            console.error("Download Error:", error.message);
            return m.reply("Download failed: Unable to retrieve the audio file.");
        }
    } catch (error) {
        console.error("General Error:", error.message);
        m.reply("Download failed: " + error.message);
    }
};