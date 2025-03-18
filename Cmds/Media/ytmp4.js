const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    try {
        // Check if input is a valid YouTube URL
        if (!text.includes("youtube.com") && !text.includes("youtu.be")) {
            return client.sendMessage(m.chat, { text: "❌ Please provide a valid YouTube link." }, { quoted: m });
        }

        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(text)}`;
        let { data } = await axios.get(apiUrl);

        if (!data || !data.result || !data.result.title || !data.result.qualities) {
            return client.sendMessage(m.chat, { text: "⚠️ Failed to fetch video details. Try another link." }, { quoted: m });
        }

        let { title, thumbnail, qualities } = data.result;
        let bestQuality = qualities.find(q => q.quality === "720p") || qualities[0];

        if (!bestQuality || !bestQuality.url) {
            return client.sendMessage(m.chat, { text: "⚠️ No valid download link found for this video." }, { quoted: m });
        }

        let responseMessage = `📥 *YouTube MP4 Download*\n\n🎬 *Title:* ${title}\n📎 *Download:* [Click Here](${bestQuality.url})\n\n📸 *Thumbnail:*`;

        // Send video thumbnail
        await client.sendMessage(m.chat, { image: { url: thumbnail }, caption: responseMessage }, { quoted: m });

    } catch (error) {
        console.error("Error fetching video:", error);
        return client.sendMessage(m.chat, { text: "⚠️ Error fetching video. Please try again later." }, { quoted: m });
    }
};