const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) {
        return m.reply("🎵 *Enter the song name to download as MP3!*\n\nExample:\n`.song Alan Walker Faded`");
    }

    try {
        // Notify user that search is in progress
        await client.sendMessage(m.chat, {
            text: "🔍 *Searching for your song... Please wait!* ⏳"
        });

        // API request to search for the song
        const searchUrl = `https://fastrestapis.fasturl.cloud/downup/ytsearch?query=${encodeURIComponent(text)}`;
        const searchResponse = await axios.get(searchUrl, { headers: { accept: "application/json" } });

        if (searchResponse.data.status !== 200 || !searchResponse.data.result || searchResponse.data.result.length === 0) {
            return m.reply("❌ *Song not found!* Please try again with a different name.");
        }

        // Extract first search result
        const songData = searchResponse.data.result[0];  
        const videoUrl = songData.url;  

        // Notify user that the song is being processed
        await client.sendMessage(m.chat, {
            text: `🎶 *Found:* ${songData.title}\n⏳ *Downloading MP3... Please wait!*`
        });

        // API request to download MP3 from the found video
        const downloadUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(videoUrl)}&quality=128kbps`;
        const downloadResponse = await axios.get(downloadUrl, { headers: { accept: "application/json" } });

        if (downloadResponse.data.status !== 200 || !downloadResponse.data.result.url) {
            return m.reply("❌ *Failed to fetch the song!* Please try again later.");
        }

        // Extract MP3 download details
        const { url, title, thumbnail } = downloadResponse.data.result;

        // Construct song download message
        const songMessage = {
            caption: `🎶 *Song Downloaded Successfully!*\n\n🎵 *Title:* ${title}\n🔗 *Download:* [Click Here](${url})\n\n✨ _Powered by VOX-MD_`,
            image: { url: thumbnail }
        };

        // Send song details with the thumbnail
        await client.sendMessage(m.chat, songMessage, { quoted: m });

    } catch (error) {
        console.error("Song download error:", error.message);
        m.reply("❌ *Failed to fetch the song!* Please try again later.");
    }
};
