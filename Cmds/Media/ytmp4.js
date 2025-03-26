module.exports = async (context) => {
    const { client, m, text, botname, fetchJson } = context;

    if (!text) {
        return m.reply("⚠️ Provide a valid YouTube link for download.\nExample: https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    }

    try {
        // API URL with encoded text (URL)
        const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp4?url=${encodeURIComponent(text)}&quality=480&server=auto`;
        console.log("Fetching video from:", apiUrl);

        // Fetch API response
        const data = await fetchJson(apiUrl);
        console.log("API Response:", JSON.stringify(data, null, 2)); // Log response for debugging

        // Validate API response
        if (!data || data.status !== 200 || !data.result || !data.result.media) {
            return m.reply("❌ API response invalid. Please check the link or try again later.");
        }

        const videoUrl = data.result.media;
        console.log("Video URL:", videoUrl);

        // Send video message
        await client.sendMessage(
            m.chat,
            {
                video: { url: videoUrl },
                caption: `🎥 *${data.result.title}*\n📺 *Channel:* ${data.result.author.name}\n🔗 *Watch:* ${data.result.url}\n\nDownloaded by ${botname}`,
                gifPlayback: false,
            },
            { quoted: m }
        );
    } catch (e) {
        console.error("Error fetching video:", e);
        m.reply("❌ An error occurred while processing the request. Please try again.\n" + e.message);
    }
};