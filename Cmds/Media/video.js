const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) return m.reply("❌ What video do you want to download?");

    await m.reply("🔄 *VOX MD Bot is fetching your video... Please wait...*");

    const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytdown-v2?name=${encodeURIComponent(text)}&format=mp4&quality=720`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data.status !== 200 || !data.result.media) {
            return m.reply("❌ Failed to fetch the video.");
        }

        const { media, title, metadata } = data.result;
        const thumbnail = metadata.thumbnail;

        await client.sendMessage(m.chat, {
            image: { url: thumbnail },
            caption: `🎥 *${title}*\n\n📥 Downloading...`
        });

        await client.sendMessage(m.chat, {
            video: { url: media },
            caption: `✅ *Here is your video!*`,
        });

    } catch (error) {
        console.error("Error fetching video:", error);
        return m.reply("❌ Error fetching the video. Try again later.");
    }
};