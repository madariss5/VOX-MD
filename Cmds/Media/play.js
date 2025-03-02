const axios = require('axios');

module.exports = async (context) => {
    const { client, m, text } = context;

    try {
        if (!text) return m.reply("🎵 *Please provide a YouTube link!*");

        const apiUrl = `https://loader.to/ajax/download.php?url=${encodeURIComponent(text)}&format=mp3`;

        let data;
        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                }
            });
            data = response.data;
            console.log("✅ API Response:", JSON.stringify(data, null, 2));
        } catch (apiError) {
            console.error("❌ API Error:", apiError.message);
            return m.reply("🚨 *API request failed!* Please try again later.");
        }

        if (!data || !data.download_url) {
            return m.reply("❌ *Failed to retrieve audio!* Please check the link.");
        }

        const { title, author, length, thumbnail, download_url } = data;

        let message = `🎶 *Audio Download Ready!*\n\n`;
        message += `📌 *Title:* ${title}\n`;
        message += `🎤 *Channel:* ${author}\n`;
        message += `⏳ *Duration:* ${length} seconds\n\n`;
        message += `📥 *Downloading...*`;

        await m.reply(message);

        await client.sendMessage(
            m.chat,
            {
                document: { url: download_url },
                mimetype: "audio/mpeg",
                fileName: `${title}.mp3`,
            },
            { quoted: m }
        );

    } catch (error) {
        console.error("General Error:", error.message);
        m.reply("❌ *Download failed.* Please try again later.");
    }
};
