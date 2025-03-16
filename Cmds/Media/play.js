const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

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
            const tempFile = path.join(__dirname, `${title}.mp3`);
            const convertedFile = path.join(__dirname, `converted_${title}.mp3`);

            // Download the audio file
            const response = await fetch(audioUrl);
            const buffer = await response.buffer();
            fs.writeFileSync(tempFile, buffer);

            // Convert using FFmpeg
            ffmpeg(tempFile)
                .output(convertedFile)
                .audioCodec("libmp3lame")
                .toFormat("mp3")
                .on("end", async () => {
                    await client.sendMessage(
                        m.chat,
                        {
                            audio: fs.readFileSync(convertedFile),
                            mimetype: "audio/mpeg",
                            fileName: `${title}.mp3`,
                        },
                        { quoted: m }
                    );

                    // Cleanup files
                    fs.unlinkSync(tempFile);
                    fs.unlinkSync(convertedFile);
                })
                .on("error", (err) => {
                    console.error("FFmpeg conversion error:", err.message);
                    m.reply("Error: Failed to process audio.");
                })
                .run();
        } catch (error) {
            console.error("API request failed:", error.message);
            m.reply("Download failed: Unable to retrieve audio.");
        }
    } catch (error) {
        m.reply("Download failed\n" + error.message);
    }
};