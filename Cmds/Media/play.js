module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;
    const yts = require("yt-search");

    try {
        if (!text) return m.reply("What song do you want to download?");

        const { videos } = await yts(text);
        if (!videos || videos.length === 0) {
            return m.reply("No songs found!");
        }

        const urlYt = videos[0].url;

        try {
            let data = await fetchJson(`https://kanambo.voxnet2025.workers.dev/downup/ytmp3?url=${encodeURIComponent(urlYt)}&quality=128kbps`);

            if (!data || !data.result || !data.result.url) {
                return m.reply("Error: Failed to retrieve a valid audio file.");
            }

            const { title, url: audioUrl } = data.result;

            if (!audioUrl.startsWith("http")) {
                return m.reply("Error: Invalid audio URL.");
            }

            await m.reply(`_Downloading **${title}**..._`);

            await client.sendMessage(
                m.chat,
                {
                    audio: { url: audioUrl },
                    mimetype: "audio/mpeg", // Changed from 'audio/mp4' to 'audio/mpeg' for compatibility
                    fileName: `${title}.mp3`,
                    ptt: false, // Ensures it's sent as normal audio, not voice note
                },
                { quoted: m }
            );
        } catch (error) {
            console.error("API request failed:", error.message);
            m.reply("Download failed: Unable to retrieve audio.");
        }
    } catch (error) {
        m.reply("Download failed\n" + error.message);
    }
};