const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    try {
        if (!text) return m.reply("🎵 *Please provide a song name!*");

        // Fetch YouTube video URL based on search query
        let searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(text)}&key=YOUR_YOUTUBE_API_KEY&type=video&maxResults=1`;

        let searchData;
        try {
            searchData = await fetchJson(searchUrl);
            console.log("✅ YouTube Search Response:", JSON.stringify(searchData, null, 2));
        } catch (searchError) {
            console.error("❌ YouTube Search API Error:", searchError.message);
            return m.reply("🚨 *Failed to search YouTube!* Please try again.");
        }

        if (!searchData || !searchData.items || searchData.items.length === 0) {
            return m.reply("❌ *No results found!* Please try a different song.");
        }

        const videoId = searchData.items[0].id.videoId;
        const videoTitle = searchData.items[0].snippet.title;
        const videoChannel = searchData.items[0].snippet.channelTitle;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // Fetch MP3 download link
        const downloadUrl = `https://loader.to/ajax/download.php?url=${encodeURIComponent(videoUrl)}&format=mp3`;

        let downloadData;
        try {
            const response = await axios.get(downloadUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
                }
            });
            downloadData = response.data;
            console.log("✅ Download API Response:", JSON.stringify(downloadData, null, 2));
        } catch (downloadError) {
            console.error("❌ Download API Error:", downloadError.message);
            return m.reply("🚨 *Failed to retrieve download link!* Please try again.");
        }

        if (!downloadData || !downloadData.link) {
            return m.reply("❌ *Download link not found!* Try another song.");
        }

        const mp3Url = downloadData.link;

        let message = `🎶 *Audio Download Ready!*\n\n`;
        message += `📌 *Title:* ${videoTitle}\n`;
        message += `🎤 *Channel:* ${videoChannel}\n`;
        message += `🔗 *YouTube Link:* ${videoUrl}\n\n`;
        message += `📥 *Downloading...*`;

        await m.reply(message);

        await client.sendMessage(
            m.chat,
            {
                document: { url: mp3Url },
                mimetype: "audio/mpeg",
                fileName: `${videoTitle}.mp3`,
            },
            { quoted: m }
        );

    } catch (error) {
        console.error("General Error:", error.message);
        m.reply("❌ *Download failed.* Please try again later.");
    }
};
