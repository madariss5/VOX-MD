const axios = require("axios");
const ytSearch = require("yt-search");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) return m.reply("❌ What video do you want to download?");

    await m.reply("🔄 *VOX MD Bot is fetching your video... Please wait...*");

    try {
        let search = await ytSearch(text);
        let video = search.videos[0];

        if (!video) return m.reply("❌ No results found. Please refine your search.");

        let link = video.url;
        let api = `https://fastrestapis.fasturl.cloud/downup/ytdown-v1?url=${encodeURIComponent(link)}&format=mp4&quality=720&server=auto`;

        console.log("API Request:", api); // Debugging

        async function fetchVideo(apiUrl, retries = 3, delay = 5000) {
            for (let attempt = 1; attempt <= retries; attempt++) {
                try {
                    const response = await axios.get(apiUrl, { timeout: 30000, headers: { "accept": "application/json" } });

                    if (response.data && response.data.status === 200 && response.data.result) {
                        return response.data.result;
                    } else {
                        throw new Error(response.data.error || "Invalid API response");
                    }
                } catch (error) {
                    console.error(`Attempt ${attempt} failed: ${error.message}`);
                    
                    if (error.response && error.response.status === 403) {
                        console.log("⚠️ API rate limit or permission issue. Retrying...");
                    }

                    if (attempt < retries) {
                        await new Promise(res => setTimeout(res, delay)); // Wait before retrying
                    } else {
                        throw new Error("API request failed after multiple attempts.");
                    }
                }
            }
        }

        let data = await fetchVideo(api);

        let videoData = {
            title: data.title,
            artist: data.author.name,
            thumbnail: data.metadata.thumbnail,
            videoUrl: data.url,
            downloadUrl: data.media
        };

        // Send metadata & thumbnail
        await client.sendMessage(
            m.chat,
            {
                image: { url: videoData.thumbnail },
                caption: `KANAMBO THE VOX MD BOT
╭═════════════════⊷
║ 🎬 *Title:* ${videoData.title}
║ 🎤 *Artist:* ${videoData.artist}
╰═════════════════⊷
*Powered by VOX MD BOT*`
            },
            { quoted: m }
        );

        // Send as a regular video
        await client.sendMessage(
            m.chat,
            {
                video: { url: videoData.downloadUrl },
                mimetype: "video/mp4",
                caption: `🎬 *${videoData.title}*`,
            },
            { quoted: m }
        );

        // Send success message
        await m.reply("✅ *Successfully sent! 🎬*");

    } catch (error) {
        console.error("Error:", error.message);
        return m.reply("❌ Download failed\n" + error.message);
    }
};