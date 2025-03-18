const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    try {
        // Validate if text is a YouTube link
        if (!text || (!text.includes("youtube.com") && !text.includes("youtu.be"))) {
            return client.sendMessage(m.chat, { text: "❌ Please provide a valid YouTube link." }, { quoted: m });
        }

        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(text)}`;
        let response = await axios.get(apiUrl);

        if (!response || !response.data || !response.data.result) {
            return client.sendMessage(m.chat, { text: "⚠️ Failed to fetch video details. Try another link." }, { quoted: m });
        }

        let { title, thumbnail, qualities } = response.data.result;

        if (!title || !qualities || qualities.length === 0) {
            return client.sendMessage(m.chat, { text: "⚠️ No valid download link found for this video." }, { quoted: m });
        }

        // Try to get 720p, otherwise, get the best available quality
        let bestQuality = qualities.find(q => q.quality === "720p") || qualities[0];

        if (!bestQuality || !bestQuality.url) {
            return client.sendMessage(m.chat, { text: "⚠️ No valid download link found for this video." }, { quoted: m });
        }

        let responseMessage = `📥 *YouTube MP4 Download*\n\n🎬 *Title:* ${title}\n📎 *Download:* [Click Here](${bestQuality.url})\n\n📸 *Thumbnail:*`;

        // Send video thumbnail with message
        return client.sendMessage(m.chat, { image: { url: thumbnail }, caption: responseMessage }, { quoted: m });

    } catch (error) {
        console.error("Error fetching video:", error);
        return client.sendMessage(m.chat, { text: "⚠️ Error fetching video. Please try again later." }, { quoted: m });
    }
};