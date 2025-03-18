const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    try {
        let urls = text.match(/(?:https?:\/\/)?(?:youtu\.be\/|(?:www\.|m\.)?youtube\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|playlist\?list=)?)([a-zA-Z0-9_-]{11})/gi);
        if (!urls) return m.reply("❌ Please provide a valid YouTube link.");

        try {
            const primaryUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp4?url=${encodeURIComponent(text)}&quality=720`;
            const primaryData = await fetchJson(primaryUrl);

            if (!primaryData || !primaryData.success || !primaryData.result || !primaryData.result.url) {
                throw new Error("Invalid response from primary API.");
            }

            const { title, url: videoUrl } = primaryData.result;

            await m.reply(`📥 Downloading *${title}*...`);
            await client.sendMessage(
                m.chat,
                {
                    video: { url: videoUrl },
                    mimetype: "video/mp4",
                    caption: title,
                    fileName: `${title}.mp4`,
                },
                { quoted: m }
            );

            await client.sendMessage(
                m.chat,
                {
                    document: { url: videoUrl },
                    mimetype: "video/mp4",
                    caption: title,
                    fileName: `${title}.mp4`,
                },
                { quoted: m }
            );

        } catch (primaryError) {
            console.error("Primary API failed:", primaryError.message);
            m.reply("⚠️ Download failed: Unable to retrieve video.");
        }
    } catch (error) {
        console.error(error);
        m.reply("❌ Download failed: " + error.message);
    }
};