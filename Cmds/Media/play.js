const axios = require("axios");
const yts = require("yt-search");

module.exports = async (context) => {
    const { client, m, text } = context;

    try {
        if (!text) return m.reply("What song do you want to download?");

        // Search for the song on YouTube
        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return m.reply("No songs found!");
        }

        const urlYt = videos[0].url; // Get the first video URL

        try {
            // Fetch audio download link from the new API
            let response = await axios.get(
                `https://kanambo.voxnet2025.workers.dev/downup/ytmp3?url=${encodeURIComponent(urlYt)}&quality=128kbps`,
                { headers: { accept: "application/json" } }
            );
            
            let data = response.data;

            if (!data || !data.result || !data.result.media) {
                return m.reply("❌ Error: No valid audio URL found.");
            }

            const { title, media: audioUrl, metadata, author } = data.result;

            // Log the download URL for debugging
            console.log("Downloading from URL:", audioUrl);

            // Send song metadata as a reply
            let caption = `🎵 *Title:* ${title}\n👤 *Artist:* ${author.name}\n⏳ *Duration:* ${metadata.lengthSeconds}s\n👁 *Views:* ${metadata.views}\n\n🎧 *Downloading...*`;

            await client.sendMessage(m.chat, { image: { url: metadata.thumbnail }, caption }, { quoted: m });

            // Send the audio file as a voice note (WhatsApp-friendly)
            await client.sendMessage(
                m.chat,
                {
                    audio: { url: audioUrl },
                    mimetype: "audio/mp3",
                    ptt: false, // Set to `true` if you want it as a voice note
                },
                { quoted: m }
            );

        } catch (error) {
            console.error("API request failed:", error.message);
            return m.reply("❌ Download failed: Unable to retrieve audio.");
        }
    } catch (error) {
        return m.reply("❌ Download failed\n" + error.message);
    }
};