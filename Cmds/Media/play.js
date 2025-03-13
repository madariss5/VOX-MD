module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;
    const yts = require("yt-search");

    try {
        if (!text) return m.reply("🎵 *What song do you want to download?*");

        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return m.reply("❌ *No songs found!*");
        }

        const urlYt = videos[0].url;
        const songTitle = videos[0].title.replace(/[^\w\s]/gi, ""); // Remove special characters

        // Show "Please wait..." message immediately
        await m.reply("⏳ *Please wait...*");

        try {
            let data = await fetchJson(`https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(urlYt)}&quality=128kbps`);

            if (!data || data.status !== 200 || !data.result || !data.result.media) {
                throw new Error("Failed to fetch the song.");
            }

            const audioUrl = data.result.media;

            await client.sendMessage(
                m.chat,
                {
                    document: { url: audioUrl },
                    mimetype: "audio/mpeg",
                    fileName: `${songTitle}.mp3`, // Cleaned song title as filename
                },
                { quoted: m }
            );
        } catch (error) {
            console.error("API request failed:", error.message);
            m.reply("❌ *Download failed: Unable to retrieve audio.*");
        }
    } catch (error) {
        m.reply("❌ *Download failed:*\n" + error.message);
    }
};
