const axios = require('axios');

async function downloadYouTubeMP4(url, sender) {
    try {
        if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
            return "❌ Please provide a valid YouTube link.";
        }

        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(url)}`;
        let { data } = await axios.get(apiUrl);

        if (!data || !data.result || !data.result.title || !data.result.qualities) {
            return "⚠️ Failed to fetch video details. Try another link.";
        }

        let { title, thumbnail, qualities } = data.result;
        let bestQuality = qualities.find(q => q.quality === "720p") || qualities[0];

        if (!bestQuality || !bestQuality.url) {
            return "⚠️ No valid download link found for this video.";
        }

        let responseMessage = `📥 *YouTube MP4 Download*\n\n🎬 *Title:* ${title}\n📎 *Download:* [Click Here](${bestQuality.url})\n\n📸 *Thumbnail:*`;

        return { text: responseMessage, image: thumbnail };
    } catch (error) {
        console.error("Error fetching video:", error);
        return "⚠️ Error fetching video. Please try again later.";
    }
}