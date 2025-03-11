const fetch = require("node-fetch");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) return m.reply("🎵 *What song do you want to download?*");

    try {
        const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=https://youtube.com/watch?v=${encodeURIComponent(text)}&quality=128kbps`;
        
        // Fetch API response
        let res = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "User-Agent": "Mozilla/5.0 (compatible; MyBot/1.0; +https://mybot.com)"
            }
        });

        // Parse JSON response
        let data = await res.json();

        // Check API response
        if (!data || data.status !== 200 || !data.result || !data.result.media) {
            throw new Error("Failed to fetch the song.");
        }

        // Extract details
        const { title, media, metadata, author, url } = data.result;
        const caption = `🎵 *Title:* ${title}\n⏳ *Duration:* ${metadata.duration}\n👤 *Artist:* ${author.name}\n📅 *Uploaded:* ${metadata.uploadDate}\n📈 *Views:* ${metadata.views}\n🔗 *YouTube Link:* ${url}\n🎶 *Format:* MP3 (128kbps)`;

        // Send thumbnail with song details
        await client.sendMessage(m.chat, { image: { url: metadata.thumbnail }, caption }, { quoted: m });

        // Send MP3 file
        await client.sendMessage(
            m.chat,
            {
                document: { url: media },
                mimetype: "audio/mpeg",
                fileName: `${title}.mp3`
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("Error fetching the song:", error.message);
        m.reply("❌ *Download failed: Unable to retrieve audio.*");
    }
};
