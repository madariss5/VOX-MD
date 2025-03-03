const axios = require("axios");
const yts = require("yt-search");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) {
        return m.reply("❌ *Error:* What song do you want to download?");
    }

    try {
        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return m.reply("❌ *Error:* No songs found!");
        }

        const urlYt = videos[0].url;
        const apiKey = "c85d8cd99e55ad019bac35fd7877c28d"; // Your API Key
        const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(urlYt)}&quality=128kbps`;

        const { data } = await axios.get(apiUrl, {
            headers: {
                "accept": "application/json",
                "x-api-key": apiKey
            }
        });

        if (data.status === 200 && data.result && data.result.media) {
            const { media, metadata } = data.result;
            const { title } = metadata;

            await m.reply(`⏳ *Downloading:* ${title}`);

            await client.sendMessage(
                m.chat,
                {
                    document: { url: media },
                    mimetype: "audio/mpeg",
                    fileName: `${title}.mp3`
                },
                { quoted: m }
            );
        } else {
            throw new Error("Invalid API response");
        }

    } catch (error) {
        console.error("API request failed:", error);
        m.reply("❌ *Download failed:* Unable to retrieve audio.");
    }
};
