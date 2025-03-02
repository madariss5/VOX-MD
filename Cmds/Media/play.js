const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    try {
        if (!text) {
            return m.reply("🎵 *Please provide a song name!*\nExample: *.play Alan Walker Faded*");
        }

        // ✅ Use your YouTube API Key
        const YOUTUBE_API_KEY = "AIzaSyDq8-DaZcV-sARibHL4_7Bkt-kQvhK67-s";

        // 🔍 Step 1: Search YouTube for the video
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(text)}&type=video&maxResults=1&key=${YOUTUBE_API_KEY}`;
        
        let searchResponse;
        try {
            searchResponse = await axios.get(searchUrl);
        } catch (error) {
            console.error("❌ YouTube API Error:", error.response?.data || error.message);
            return m.reply("🚨 *YouTube search failed!* Try again later.");
        }

        // 🎥 Extract video details
        const video = searchResponse.data.items[0];
        if (!video) return m.reply("❌ *No results found!* Try another song.");

        const videoId = video.id.videoId;
        const videoTitle = video.snippet.title;
        const videoChannel = video.snippet.channelTitle;
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // 🔽 Step 2: Fetch MP3 download link from Loader.to
        const loaderUrl = `https://loader.to/ajax/progress.php?url=${encodeURIComponent(youtubeUrl)}&format=mp3`;

        let downloadResponse;
        try {
            downloadResponse = await axios.get(loaderUrl);
        } catch (error) {
            console.error("❌ Loader.to API Error:", error.response?.data || error.message);
            return m.reply("🚨 *Failed to fetch MP3 link!* Try again.");
        }

        // 🔗 Extract MP3 download URL
        const downloadData = downloadResponse.data;
        if (!downloadData || !downloadData.download_url) {
            return m.reply("❌ *Download failed!* Try another song.");
        }
        const mp3Url = downloadData.download_url;

        // ✅ Step 3: Send Confirmation Message
        let message = `🎶 *Audio Download Ready!*\n\n`;
        message += `📌 *Title:* ${videoTitle}\n`;
        message += `🎤 *Channel:* ${videoChannel}\n`;
        message += `🔗 *YouTube Link:* ${youtubeUrl}\n\n`;
        message += `📥 *Downloading...*`;

        await m.reply(message);

        // 🎵 Step 4: Send MP3 file to the user
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
