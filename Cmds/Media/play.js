module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;
    const yts = require("yt-search");

    try {
        if (!text) return m.reply("What song do you want to download?");

        console.log(`🔍 Searching for: ${text}`);
        const { videos } = await yts(text);
        
        if (!videos || videos.length === 0) {
            console.log("❌ No songs found!");
            return m.reply("No songs found!");
        }

        const urlYt = videos[0].url;
        console.log(`🎵 YouTube URL: ${urlYt}`);

        try {
            const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(urlYt)}&quality=128kbps`;
            console.log(`📡 Fetching from API: ${apiUrl}`);

            let response = await fetchJson(apiUrl);
            console.log("📥 API Response:", response);

            // Validate API response
            if (!response || response.status !== 200 || !response.result || !response.result.media) {
                console.log("⚠️ Error: Invalid API response structure");
                return m.reply("Download failed: Invalid API response.");
            }

            const { title, media: audioUrl } = response.result;
            
            if (!audioUrl) {
                console.log("⚠️ Error: No valid audio URL found in API response");
                return m.reply("Download failed: No valid audio URL found.");
            }

            console.log(`✅ Download URL: ${audioUrl}`);

            await m.reply(`_Downloading ${title}_`);

            await client.sendMessage(
                m.chat,
                {
                    document: { url: audioUrl },
                    mimetype: "audio/mpeg",
                    fileName: `${title}.mp3`,
                },
                { quoted: m }
            );

            console.log("✅ MP3 sent successfully!");

        } catch (error) {
            console.error("❌ API request failed:", error.response ? error.response.status : error.message);
            console.log("🛑 Error details:", error.response ? error.response.data : "No response data");
            m.reply("Download failed: Unable to retrieve audio.");
        }
    } catch (error) {
        console.error("🚨 Unexpected error:", error.message);
        m.reply("Download failed\n" + error.message);
    }
};