const axios = require("axios");
const ytSearch = require("yt-search");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) return m.reply("❌ What song do you want to download?");

    await m.reply("🔄 *VOX MD Bot is fetching your audio... Please wait...*");

    try {
        let search = await ytSearch(text);
        let video = search.videos[0];

        if (!video) return m.reply("❌ No results found. Please refine your search.");

        let link = video.url;
        let apis = [
            `https://apis.davidcyriltech.my.id/youtube/mp3?url=${link}`,
            `https://fastrestapis.fasturl.cloud/downup/ytmp3?url=${link}`,
            `https://kanambo.voxnet2025.workers.dev/downup/ytmp3?url=${link}&quality=128kbps&server=server2`,
            `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${link}`,
            `https://api.vevioz.com/api/button/mp3?url=${link}`
        ];

        async function fetchWithRetry(url, retries = 3, delay = 3000) {
            for (let i = 0; i < retries; i++) {
                try {
                    const response = await axios.get(url, { timeout: 10000 });
                    if (response.data && (response.data.status === 200 || response.data.success)) {
                        return response.data;
                    }
                    throw new Error("Invalid API response structure");
                } catch (error) {
                    console.error(`Attempt ${i + 1} failed for ${url}:`, error.message);
                    if (i < retries - 1) await new Promise(res => setTimeout(res, delay));
                }
            }
            throw new Error(`Failed to fetch from ${url} after ${retries} retries`);
        }

        for (const api of apis) {
            try {
                let data = await fetchWithRetry(api);

                let audioUrl = data.result?.downloadUrl || data.url;
                if (!audioUrl) throw new Error("No download URL found");

                let songData = {
                    title: data.result?.title || video.title,
                    artist: data.result?.author || video.author.name,
                    thumbnail: data.result?.image || video.thumbnail,
                    videoUrl: link,
                    fileName: `${video.title.replace(/[^a-zA-Z0-9 ]/g, "")}.mp3`
                };

                // Send metadata & thumbnail with buttons
                let buttons = [
                    { buttonId: `audio_${audioUrl}_${songData.fileName}`, buttonText: { displayText: "🎵 Send as Audio" }, type: 1 },
                    { buttonId: `document_${audioUrl}_${songData.fileName}`, buttonText: { displayText: "📄 Send as Document" }, type: 1 }
                ];

                let buttonMessage = {
                    image: { url: songData.thumbnail },
                    caption: `KANAMBO THE VOX MD BOT
╭═════════════════⊷
║ 🎶 *Title:* ${songData.title}
║ 🎤 *Artist:* ${songData.artist}
╰═════════════════⊷
*Powered by VOX MD BOT*`,
                    footer: "Select an option below",
                    buttons: buttons,
                    headerType: 4
                };

                await client.sendMessage(m.chat, buttonMessage, { quoted: m });

                return; // Stop execution if successful
            } catch (e) {
                console.error(`API Error (${api}):`, e.message);
                continue;
            }
        }

        return m.reply("⚠️ An error occurred. All APIs might be down or unable to process the request.");
    } catch (error) {
        return m.reply("❌ Download failed\n" + error.message);
    }
};

// Button response handling
module.exports.onButtonClick = async (context) => {
    const { client, m } = context;
    let buttonId = m.message.buttonsResponseMessage.selectedButtonId;
    let chatId = m.key.remoteJid;

    if (buttonId.startsWith("audio_")) {
        let [, audioUrl, fileName] = buttonId.split("_");

        await client.sendMessage(
            chatId,
            {
                audio: { url: audioUrl },
                mimetype: "audio/mp4",
            },
            { quoted: m }
        );
    } else if (buttonId.startsWith("document_")) {
        let [, docUrl, fileName] = buttonId.split("_");

        await client.sendMessage(
            chatId,
            {
                document: { url: docUrl },
                mimetype: "audio/mp3",
                fileName: fileName || "song.mp3",
            },
            { quoted: m }
        );
    }
};