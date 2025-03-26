const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text || !text.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/)) {
        return m.reply("❌ Please provide a valid YouTube link!\n\nExample: `.ytmp4 https://youtube.com/watch?v=MwpMEbgC7DA`");
    }

    await m.reply("🔄 *VOX MD Bot is fetching your video... Please wait...*");

    const link = text.trim();
    const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${link}`;

    try {
        const response = await axios.get(apiUrl, { timeout: 10000 }); // 10s timeout

        if (!response.data || response.data.status !== 200 || !response.data.success || !response.data.result?.download_url) {
            throw new Error("Invalid API response or no download URL found");
        }

        let videoData = {
            title: response.data.result.title || "Unknown Title",
            quality: response.data.result.quality || "Unknown Quality",
            thumbnail: response.data.result.thumbnail || "https://i.ytimg.com/vi/default.jpg",
            videoUrl: link,
            downloadUrl: response.data.result.download_url
        };

        // Send metadata & thumbnail
        await client.sendMessage(
            m.chat,
            {
                image: { url: videoData.thumbnail },
                caption: `KANAMBO THE VOX MD BOT
╭═════════════════⊷
║ 📽️ *Title:* ${videoData.title}
║ 🎞️ *Quality:* ${videoData.quality}
║ 🔗 *Video Link:* [Watch Here](${videoData.videoUrl})
╰═════════════════⊷
*Powered by VOX MD BOT*`
            },
            { quoted: m }
        );

        // Send as a video file
        await client.sendMessage(
            m.chat,
            {
                video: { url: videoData.downloadUrl },
                mimetype: "video/mp4",
                caption: `🎥 *${videoData.title}* - ${videoData.quality}`
            },
            { quoted: m }
        );

        // Send success message
        await m.reply("✅ *Successfully sent! 🎬*");

    } catch (error) {
        console.error(`API Error:`, error.message);
        return m.reply("⚠️ An error occurred. The API might be down or unable to process the request.");
    }
};