module.exports = async (context) => {
    const { client, m, text, botname, fetchJson } = context;

    if (!text) {
        return m.reply("Provide a valid YouTube link for download.\nExample: https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    }

    try {
        // API URL with encoded text (URL)
        const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp4?url=${encodeURIComponent(text)}&quality=480&server=auto`;
        const data = await fetchJson(apiUrl);

        // Validate API response
        if (!data || data.status !== 200 || !data.result || !data.result.videoUrl) {
            return m.reply("Sorry, the API didn't respond correctly. Please try again later.");
        }

        const videoUrl = data.result.videoUrl;

        // Send video message
        await client.sendMessage(
            m.chat,
            {
                video: { url: videoUrl },
                caption: `🎥 Downloaded by ${botname}`,
                gifPlayback: false,
            },
            { quoted: m }
        );
    } catch (e) {
        m.reply("❌ An error occurred. The API might be down.\n" + e);
    }
};