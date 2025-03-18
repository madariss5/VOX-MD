const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    try {
        let urls = text.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/gi);
        if (!urls) return m.reply("❌ Please provide a valid YouTube link.");

        try {
            const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp4?url=${encodeURIComponent(text)}&quality=720`;
            const response = await axios.get(apiUrl, { headers: { Accept: "application/json" } });

            console.log("🔍 API Response:", JSON.stringify(response.data, null, 2)); // Log response for debugging

            if (response.data?.status !== 200 || !response.data?.result?.media) {
                throw new Error("Invalid response structure from API.");
            }

            // Extract video info
            const videoUrl = response.data.result.media;
            const title = response.data.result.title || "YouTube Video";

            await m.reply(`📥 Downloading *${title}*...`);

            await client.sendMessage(
                m.chat,
                {
                    video: { url: videoUrl },
                    mimetype: "video/mp4",
                    caption: `🎬 *Title:* ${title}`,
                    fileName: `${title}.mp4`,
                },
                { quoted: m }
            );

            await client.sendMessage(
                m.chat,
                {
                    document: { url: videoUrl },
                    mimetype: "video/mp4",
                    caption: `🎬 *Title:* ${title}`,
                    fileName: `${title}.mp4`,
                },
                { quoted: m }
            );

        } catch (apiError) {
            console.error("❌ API Error:", apiError.message);
            m.reply("⚠️ Download failed: The API response was not valid.");
        }
    } catch (error) {
        console.error("❌ Unexpected Error:", error.message);
        m.reply("❌ Download failed: " + error.message);
    }
};