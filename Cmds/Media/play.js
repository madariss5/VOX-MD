const fetch = require("node-fetch");
const yts = require("youtube-yts");
const { ytmp4 } = require("api-qasim");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { pipeline } = require("stream");
const ffmpeg = require("fluent-ffmpeg");
const mime = require("mime-types");

const streamPipeline = promisify(pipeline);
const customTmpDir = path.join(__dirname, "custom_tmp");
if (!fs.existsSync(customTmpDir)) fs.mkdirSync(customTmpDir);

module.exports = async (context) => {
    const { client, m, text } = context;
    if (!text) return client.sendMessage(m.chat, { text: "✳️ Enter a song name to search!" }, { quoted: m });

    await client.sendMessage(m.chat, { react: { text: "🎶", key: m.key } });

    try {
        const searchResults = await yts(text);
        if (!searchResults.videos.length) {
            return client.sendMessage(m.chat, { text: "❌ No results found." }, { quoted: m });
        }

        const video = searchResults.videos[0];
        const response = await ytmp4(video.url);
        if (!response || !response.video) throw new Error("No video URL found.");

        const videoUrl = response.video;
        const videoPath = path.join(customTmpDir, "video.mp4");
        const audioPath = path.join(customTmpDir, "audio.mp3");

        const mediaResponse = await fetch(videoUrl);
        if (!mediaResponse.ok) throw new Error("Failed to fetch video.");

        await streamPipeline(mediaResponse.body, fs.createWriteStream(videoPath));

        await new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .audioCodec("libmp3lame")
                .audioBitrate(128)
                .toFormat("mp3")
                .on("end", resolve)
                .on("error", reject)
                .save(audioPath);
        });

        const audioBuffer = fs.readFileSync(audioPath);
        const base64Audio = audioBuffer.toString("base64");
        const audioMimeType = mime.lookup(audioPath) || "audio/mpeg";

        await client.sendMessage(m.chat, {
            document: { url: `data:${audioMimeType};base64,${base64Audio}` },
            mimetype: audioMimeType,
            fileName: `${video.title}.mp3`,
            caption: `🎵 *Title:* ${video.title}\n👤 *Artist:* ${video.author.name}\n⏳ *Duration:* ${video.timestamp}\n🔗 *Source:* ${video.url}`
        }, { quoted: m });

        fs.unlinkSync(videoPath);
        fs.unlinkSync(audioPath);
    } catch (error) {
        console.error("Error:", error.message);
        await client.sendMessage(m.chat, { text: "❌ An error occurred while fetching the song. Try again later." }, { quoted: m });
    }
};
