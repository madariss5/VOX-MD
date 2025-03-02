const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    try {
        if (!text) {
            return m.reply("🎵 *Please provide a song name!*\nExample: *.play Alan Walker Faded*");
        }

        // Your YouTube API Key (Replace with your actual key)
        const YOUTUBE_API_KEY = "AIzaSyDq8-DaZcV-sARibHL4_7Bkt-kQvhK67-s";

        // Step 1: Search YouTube for the video
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(text)}&type=video&maxResults=1&key=${YOUTUBE_API_KEY}`;
        
        let searchResponse;
        try {
            searchResponse = await axios.get(searchUrl);
        } catch (error) {
            console.error("❌ YouTube API Error:", error.response?.data || error.message);
            return m.reply("🚨 *Failed to search YouTube!* Please try again later.");
        }

        // Extract video ID
        const video = searchResponse.data.items[0];
        if (!video) {
            return m.reply("❌ *No results found!* Try another song name.");
        }
        const videoId = video.id.videoId;
        const videoTitle = video.snippet.title;
        const videoChannel = video.snippet.channelTitle;
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // Step 2: Fetch MP3 download link from api.ryzendesu.vip
        const downloadUrl = `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${encodeURIComponent(youtubeUrl)}`;

        let downloadResponse;
        try {
            downloadResponse = await axios.get(downloadUrl, {
                headers: { "Accept": "application/json" }
            });
        } catch (error) {
            console.error("❌ Download API Error:", error.response?.data || error.message);
            return m.reply("🚨 *Failed to fetch MP3 download link!* Please try again.");
        }

        // Extract MP3 download URL
        const downloadData = downloadResponse.data;
        if (!downloadData || !downloadData.url) {
            return m.reply("❌ *Download failed!* Please try another song.");
        }
        const mp3Url = downloadData.url;

        // Step 3: Send confirmation message
        let message = `🎶 *Audio Download Ready!*\n\n`;
        message += `📌 *Title:* ${videoTitle}\n`;
        message += `🎤 *Channel:* ${videoChannel}\n`;
        message += `🔗 *YouTube Link:* ${youtubeUrl}\n\n`;
        message += `📥 *Downloading...*`;

        await m.reply(message);

        // Step 4: Send MP3 file to the user
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
        console.error("❌ General Error:", error.message);
        m.reply("❌ *Download failed.* Please try again later.");
    }
};
