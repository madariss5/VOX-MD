const axios = require('axios');
const fs = require('fs');
const path = require('path');
const yts = require('yt-search');

async function searchYouTube(query) {
    try {
        const results = await yts(query);
        if (!results.videos.length) return null;
        return results.videos[0].url; // Get the first video result
    } catch (error) {
        console.error("YouTube Search Error:", error);
        return null;
    }
}

async function downloadMP3(videoUrl) {
    try {
        const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(videoUrl)}&quality=128kbps`;
        const response = await axios.get(apiUrl);

        if (!response.data || !response.data.result || !response.data.result.url) {
            throw new Error("Failed to fetch MP3 download link.");
        }

        const mp3Url = response.data.result.url;
        const fileName = `${Date.now()}.mp3`;
        const filePath = path.join(__dirname, 'temp', fileName);

        const writer = fs.createWriteStream(filePath);
        const mp3Response = await axios({
            url: mp3Url,
            method: 'GET',
            responseType: 'stream'
        });

        mp3Response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(filePath));
            writer.on('error', reject);
        });

    } catch (error) {
        console.error("Download MP3 Error:", error);
        return null;
    }
}

async function handlePlayCommand(sock, msg, songName) {
    const chatId = msg.key.remoteJid;

    // Step 1: Search YouTube for the song
    const videoUrl = await searchYouTube(songName);
    if (!videoUrl) {
        return sock.sendMessage(chatId, { text: "Sorry, I couldn't find that song." });
    }

    // Step 2: Convert to MP3
    const filePath = await downloadMP3(videoUrl);
    if (!filePath) {
        return sock.sendMessage(chatId, { text: "Failed to download the song. Please try again later." });
    }

    // Step 3: Send as document
    await sock.sendMessage(chatId, {
        document: { url: filePath },
        mimetype: 'audio/mpeg',
        fileName: `${songName}.mp3`,
        caption: `Here is your requested song: ${songName}`
    });

    // Step 4: Delete file after sending
    setTimeout(() => {
        fs.unlink(filePath, (err) => {
            if (err) console.error("File Deletion Error:", err);
        });
    }, 10000);
}

module.exports = { handlePlayCommand };
