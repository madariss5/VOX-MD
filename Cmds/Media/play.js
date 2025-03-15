const fetch = require('node-fetch');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');

async function playMusic(sock, chatId, query) {
    try {
        console.log(`🎵 Searching YouTube for: ${query}`);

        // Search YouTube for the song
        const searchResults = await yts(query);
        if (!searchResults.videos.length) {
            return sock.sendMessage(chatId, { text: "❌ No results found." });
        }

        const video = searchResults.videos[0];
        const mp3Url = await getMp3DownloadLink(video.url);

        if (!mp3Url) {
            return sock.sendMessage(chatId, { text: "❌ Failed to fetch audio." });
        }

        const filePath = await downloadAudio(mp3Url, `${video.title}.mp3`);
        if (!filePath) {
            return sock.sendMessage(chatId, { text: "❌ Error downloading file." });
        }

        await sock.sendMessage(chatId, {
            document: fs.readFileSync(filePath),
            mimetype: "audio/mpeg",
            fileName: `${video.title}.mp3`,
        });

        console.log("✅ Sent audio file:", filePath);
        fs.unlinkSync(filePath);
    } catch (error) {
        console.error("❌ Error in playMusic:", error);
        sock.sendMessage(chatId, { text: "❌ Something went wrong." });
    }
}

// Fetch MP3 download link from API
async function getMp3DownloadLink(videoUrl) {
    try {
        const apiUrl = `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${encodeURIComponent(videoUrl)}&quality=128kbps`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.result?.media || null;
    } catch (error) {
        console.error("❌ Error fetching MP3 URL:", error);
        return null;
    }
}

// Download MP3 file
async function downloadAudio(mp3Url, fileName) {
    try {
        const response = await fetch(mp3Url);
        const filePath = path.join(__dirname, "downloads", fileName);
        const fileStream = fs.createWriteStream(filePath);

        return new Promise((resolve, reject) => {
            response.body.pipe(fileStream);
            response.body.on("error", reject);
            fileStream.on("finish", () => resolve(filePath));
        });
    } catch (error) {
        console.error("❌ Error downloading audio:", error);
        return null;
    }
}
