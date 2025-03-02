module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    try {
        if (!text) return m.reply("🎵 *Please provide a YouTube link!*");

        const encodedUrl = encodeURIComponent(text);
        const apiUrl = `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${encodedUrl}`;

        let data;
        try {
            data = await fetchJson(apiUrl, {
                headers: {
                    "Accept": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
                }
            });

            console.log("✅ API Response:", JSON.stringify(data, null, 2));
        } catch (apiError) {
            console.error("❌ API Error:", apiError.message);
            return m.reply("🚨 *API request failed!* Please try again later.");
        }

        if (!data || !data.url) {
            return m.reply("❌ *Failed to retrieve audio!* Please check the link.");
        }

        const { title, author, lengthSeconds, thumbnail, url, quality, filename } = data;

        let message = `🎶 *Audio Download Ready!*\n\n`;
        message += `📌 *Title:* ${title}\n`;
        message += `🎤 *Channel:* ${author}\n`;
        message += `⏳ *Duration:* ${lengthSeconds} seconds\n`;
        message += `🔉 *Quality:* ${quality}\n\n`;
        message += `📥 *Downloading...*`;

        await m.reply(message);

        await client.sendMessage(
            m.chat,
            {
                document: { url },
                mimetype: "audio/mpeg",
                fileName: `${filename}.mp3`,
            },
            { quoted: m }
        );

    } catch (error) {
        console.error("General Error:", error.message);
        m.reply("❌ *Download failed.* Please try again later.");
    }
};
