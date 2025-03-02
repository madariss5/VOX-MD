const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const yts = require('youtube-yts');
const ffmpeg = require('fluent-ffmpeg');
const mime = require('mime-types');
const { promisify } = require('util');
const { pipeline } = require('stream');
const { ytmp4 } = require('api-qasim');

const streamPipeline = promisify(pipeline);
const customTmpDir = path.join(__dirname, 'custom_tmp');
if (!fs.existsSync(customTmpDir)) fs.mkdirSync(customTmpDir);

module.exports = async (context) => {
    const { client, m, text } = context;
    if (!text) return client.sendMessage(m.chat, { text: '✳️ Enter a song name to search!' }, { quoted: m });

    client.ultra = client.ultra || {};
    await client.sendMessage(m.chat, { react: { text: '🎶', key: m.key } });

    const result = await searchAndDownloadMusic(text);
    if (!result.allLinks.length) {
        return client.sendMessage(m.chat, { text: '❌ No results found.' }, { quoted: m });
    }

    const infoText = `🎵 Reply with a number to select a song:\n\n`;
    const orderedLinks = result.allLinks.map((link, index) => `*${index + 1}.* ${link.title}`).join('\n\n');
    const fullText = `${infoText}\n${orderedLinks}`;

    const { key } = await client.sendMessage(m.chat, { text: fullText }, { quoted: m });

    client.ultra[m.sender] = {
        result,
        key,
        chatId: m.chat,
        timeout: setTimeout(() => {
            client.sendMessage(m.chat, { delete: key });
            delete client.ultra[m.sender];
        }, 150 * 1000),
    };
};

// ✅ Fix the export and function name issue
async function handleSongSelection(client, msg) {
    if (!client.ultra || !client.ultra[msg.sender]) return;
    
    const userData = client.ultra[msg.sender];
    const choice = parseInt(msg.text.trim());
    
    if (isNaN(choice) || choice < 1 || choice > userData.result.allLinks.length) {
        return client.sendMessage(msg.chat, { text: `⚠️ Choose a number between 1 and ${userData.result.allLinks.length}.` }, { quoted: msg });
    }

    delete client.ultra[msg.sender];
    
    const selectedUrl = userData.result.allLinks[choice - 1].url;
    try {
        const response = await ytmp4(selectedUrl);
        if (!response || !response.video) throw new Error('No video URL found.');

        const videoUrl = response.video;
        const mediaResponse = await fetch(videoUrl);
        const mediaBuffer = Buffer.from(await mediaResponse.arrayBuffer());

        const audioPath = path.join(customTmpDir, 'audio.mp3');
        fs.writeFileSync(audioPath, mediaBuffer);

        const caption = `🎵 *Title:* ${response.title || 'Unknown'}\n👤 *Artist:* ${response.author || 'Unknown'}\n⏳ *Duration:* ${response.duration || 'Unknown'}\n👀 *Views:* ${response.views || '0'}\n📅 *Uploaded on:* ${response.upload || 'Unknown Date'}`;

        await client.sendMessage(msg.chat, { audio: fs.readFileSync(audioPath), mimetype: mime.lookup(audioPath) || 'audio/mpeg', caption }, { quoted: msg });

        fs.unlinkSync(audioPath);
    } catch (error) {
        console.error('Error fetching video:', error.message);
        await client.sendMessage(msg.chat, { text: '❌ An error occurred while fetching the video. Try again later.' }, { quoted: msg });
    }
}

// ✅ Properly export function
module.exports.handleSongSelection = handleSongSelection;
