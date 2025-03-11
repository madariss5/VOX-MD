const fetch = require("node-fetch");
const yts = require("yt-search");

module.exports = async (context) => {
    const { client, m, text } = context;

    try {
        if (!text) return m.reply("🎵 *What song do you want to download?*");

        // Search for the song on YouTube
        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return m.reply("❌ *No songs found!*");
        }

        const urlYt = videos[0].url;
        const songTitle = videos[0].title.replace(/[^\w\s]/gi, ""); // Remove special characters

        // Send waiting message
        await m.reply("⏳ *Please wait while I fetch your song...*");

        try {
            // Fetch song download link
            let url = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(urlYt)}&quality=128kbps`;

            let res = await fetch(url, {
                method: "GET",
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    "Accept": "application/json"
                }
            });

            if (!res.ok) throw new Error(`HTTP Error! Status: ${res.status}`);

            let data = await res.json();

            if (!data || data.status !== 200 || !data.result || !data.result.media) {
                throw new Error("Invalid response from API.");
            }

            const { title, metadata, author, media } = data.result;

            // Send song details
            let caption = `🎵 *Title:* ${title}\n`
                + `⏳ *Duration:* ${metadata.duration}\n`
                + `👤 *Artist:* ${author.name}\n`
                + `📅 *Uploaded:* ${metadata.uploadDate}\n`
                + `📈 *Views:* ${metadata.views}\n`
                + `🔗 *YouTube Link:* ${data.result.url}\n`
                + `🎶 *Format:* MP3 (128kbps)`;

            await client.sendMessage(m.chat, { text: caption }, { quoted: m });

            // Send audio file
            await client.sendMessage(
                m.chat,
                {
                    document: { url: media },
                    mimetype: "audio/mpeg",
                    fileName: `${songTitle}.mp3`,
                },
                { quoted: m }
            );
        } catch (error) {
            console.error("Error fetching song:", error.message);
            m.reply("❌ *Download failed: Unable to retrieve audio.*");
        }
    } catch (error) {
        console.error("Song command error:", error.message);
        m.reply("❌ *An error occurred while processing your request.*");
    }
};
