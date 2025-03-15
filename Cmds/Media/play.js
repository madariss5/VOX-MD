module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;
    const yts = require("yt-search");
    const axios = require("axios"); // Use axios for better debugging

    try {
        if (!text) return m.reply("What song do you want to download?");

        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return m.reply("No songs found!");
        }

        const urlYt = videos[0].url;
        console.log("Searching for:", text);
        console.log("YouTube URL:", urlYt);

        try {
            const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(urlYt)}&quality=128kbps`;
            console.log("Fetching from API:", apiUrl);

            const response = await axios.get(apiUrl, {
                headers: {
                    "Accept": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", // Some APIs block non-browser requests
                },
            });

            console.log("API Response:", response.data);

            if (!response.data || !response.data.url) {
                console.log("Error: Invalid API response structure");
                return m.reply("Download failed: No valid audio URL found.");
            }

            const audioUrl = response.data.url;
            const title = videos[0].title;

            await m.reply(`_Downloading ${title}_`);

            await client.sendMessage(
                m.chat,
                {
                    document: { url: audioUrl },
                    mimetype: "audio/mpeg",
                    fileName: `${title}.mp3`,
                },
                { quoted: m }
            );
        } catch (error) {
            console.error("API request failed:", error.response ? error.response.status : error.message);
            console.log("Error details:", error.response ? error.response.data : "No response data");
            m.reply("Download failed: Unable to retrieve audio.");
        }
    } catch (error) {
        console.error("General error:", error.message);
        m.reply("Download failed\n" + error.message);
    }
};