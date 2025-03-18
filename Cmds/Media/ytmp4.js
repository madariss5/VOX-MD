const axios = require("axios");
const ytSearch = require("yt-search");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) return m.reply("❌ Please provide the name or link of the video you want to download.");

    await m.reply("🔄 *VOX MD Bot is fetching your video... Please wait...*");

    try {
        let videoUrl;
        let title;

        // If user provides a YouTube link, use it directly
        if (text.includes("youtube.com") || text.includes("youtu.be")) {
            videoUrl = text;
            title = "YouTube Video";
        } else {
            // Perform YouTube search if user provided a title
            let search = await ytSearch(text);
            let video = search.videos[0];

            if (!video) return m.reply("❌ No results found. Please refine your search.");

            videoUrl = video.url;
            title = video.title;
        }

        // Define the APIs
        let apis = [
            `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(videoUrl)}&quality=720`,
            `https://fastrestapis.fasturl.cloud/downup/ytmp4?url=${encodeURIComponent(videoUrl)}&quality=720`
        ];

        for (const api of apis) {
            try {
                let { data } = await axios.get(api, { headers: { Accept: "application/json" } });

                console.log(`🔍 API Response from ${api}:`, JSON.stringify(data, null, 2));

                // Check if response is valid
                if (data.status === 200 && data.result?.media) {
                    let videoDownloadUrl = data.result.media;
                    let thumbnail = data.result.metadata?.thumbnail || "https://www.youtube.com/img/desktop/yt_1200.png"; // Default thumbnail

                    // Send metadata & thumbnail
                    await client.sendMessage(
                        m.chat,
                        {
                            image: { url: thumbnail },
                            caption: `🎬 *Title:* ${title}\n🔗 *Link:* ${videoUrl}\n🎥 *Quality:* 720p\n\n📥 *Downloading...*`
                        },
                        { quoted: m }
                    );

                    await m.reply("📤 *Sending your video...*");

                    // Send as a video file (no document format)
                    await client.sendMessage(
                        m.chat,
                        {
                            video: { url: videoDownloadUrl },
                            mimetype: "video/mp4",
                            caption: `🎬 *Title:* ${title}`,
                        },
                        { quoted: m }
                    );

                    // Success message
                    await m.reply("✅ *Video sent successfully! 🎥*");

                    return; // Stop execution if successful
                }
            } catch (e) {
                console.error(`API Error (${api}):`, e.message);
                continue; // Try next API if one fails
            }
        }

        // If all APIs fail
        return m.reply("⚠️ All APIs might be down or unable to process the request.");
    } catch (error) {
        return m.reply("❌ Download failed\n" + error.message);
    }
};