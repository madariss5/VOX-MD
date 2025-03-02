import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import pkg from 'api-qasim';
import yts from 'youtube-yts';
import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';
import { pipeline } from 'stream';
import mime from 'mime-types';

const { ytmp4 } = pkg;
const streamPipeline = promisify(pipeline);

// Create __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Custom temporary directory
const customTmpDir = path.join(__dirname, 'custom_tmp');
if (!fs.existsSync(customTmpDir)) fs.mkdirSync(customTmpDir);

const handler = async (m, { conn, command, text, args, usedPrefix }) => {
  if (!text) {
    await conn.sendMessage(m.chat, { text: `✳️ Enter a song name. Example: *${usedPrefix + command}* sefali odia song` }, { quoted: m });
    return;
  }

  conn.ultra = conn.ultra || {};
  await conn.sendMessage(m.chat, { react: { text: '🎶', key: m.key } });

  const result = await searchAndDownloadMusic(text);
  if (!result.allLinks.length) {
    await conn.sendMessage(m.chat, { text: '❌ No results found for the search.' }, { quoted: m });
    return;
  }

  const infoText = `✦ ──『 *ULTRA PLAYER* 』── ⚝ \n\n🎵 Reply with a number to select a song:\n\n`;
  const orderedLinks = result.allLinks.map((link, index) => `*${index + 1}.* ${link.title}`).join('\n\n');
  const fullText = `${infoText}\n${orderedLinks}`;

  const { key } = await conn.sendMessage(m.chat, { text: fullText }, { quoted: m });

  conn.ultra[m.sender] = {
    result,
    key,
    timeout: setTimeout(() => {
      conn.sendMessage(m.chat, { delete: key });
      delete conn.ultra[m.sender];
    }, 150 * 1000),
  };
};

handler.before = async (m, { conn }) => {
  conn.ultra = conn.ultra || {};
  if (m.isBaileys || !(m.sender in conn.ultra)) return;

  const { result, key, timeout } = conn.ultra[m.sender];
  if (!m.quoted || m.quoted.id !== key.id || !m.text) return;

  const choice = parseInt(m.text.trim());
  if (choice < 1 || choice > result.allLinks.length) {
    await conn.sendMessage(m.chat, { text: `⚠️ Invalid choice. Choose a number between 1 and ${result.allLinks.length}.` }, { quoted: m });
    return;
  }

  const selectedUrl = result.allLinks[choice - 1].url;
  try {
    const response = await ytmp4(selectedUrl);
    if (!response || !response.video) throw new Error('No video URL found.');

    const videoUrl = response.video;
    const mediaResponse = await fetchWithRetry(videoUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json, text/plain, */*' },
    });

    const contentType = mediaResponse.headers.get('content-type');
    if (!contentType || !contentType.includes('video')) throw new Error('Invalid content type received');

    const mediaBuffer = Buffer.from(await mediaResponse.arrayBuffer());
    if (mediaBuffer.length === 0) throw new Error('Downloaded file is empty');

    // Save video temporarily
    const videoPath = path.join(customTmpDir, 'video.mp4');
    fs.writeFileSync(videoPath, mediaBuffer);

    // Convert to MP3
    const audioPath = path.join(customTmpDir, 'audio.mp3');
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .audioCodec('libmp3lame')
        .audioBitrate(128)
        .toFormat('mp3')
        .on('end', resolve)
        .on('error', reject)
        .save(audioPath);
    });

    // Ensure audio file exists
    if (!fs.existsSync(audioPath) || fs.statSync(audioPath).size === 0) throw new Error('Audio file is empty');

    const caption = `🎵 *Title:* ${response.title || 'Unknown'}\n👤 *Artist:* ${response.author || 'Unknown'}\n⏳ *Duration:* ${response.duration || 'Unknown'}\n👀 *Views:* ${response.views || '0'}\n📅 *Uploaded on:* ${response.upload || 'Unknown Date'}`;
    
    await conn.sendMessage(m.chat, { audio: fs.readFileSync(audioPath), mimetype: mime.lookup(audioPath) || 'audio/mpeg', caption }, { quoted: m });

    fs.unlinkSync(videoPath);
    fs.unlinkSync(audioPath);
  } catch (error) {
    console.error('Error fetching video:', error.message);
    await conn.sendMessage(m.chat, { text: '❌ An error occurred while fetching the video. Please try again later.' }, { quoted: m });
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }
};

handler.help = ['play'];
handler.tags = ['downloader'];
handler.command = ['play', 'song', 'spotify', 'playsong', 'ytplay'];

export default handler;

async function searchAndDownloadMusic(query) {
  try {
    const { videos } = await yts(query);
    if (!videos.length) return { allLinks: [] };

    return {
      title: videos[0].title,
      description: videos[0].description,
      duration: videos[0].duration,
      author: videos[0].author.name,
      allLinks: videos.map(video => ({ title: video.title, url: video.url })),
      videoUrl: videos[0].url,
      thumbnail: videos[0].thumbnail,
    };
  } catch (error) {
    console.error('Error:', error.message);
    return { allLinks: [] };
  }
}

async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);
    if (response.ok) return response;
  }
  throw new Error('Failed to fetch media content after retries');
                                                                                    }import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import pkg from 'api-qasim';
import yts from 'youtube-yts';
import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';
import { pipeline } from 'stream';
import mime from 'mime-types';

const { ytmp4 } = pkg;
const streamPipeline = promisify(pipeline);

// Create __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Custom temporary directory
const customTmpDir = path.join(__dirname, 'custom_tmp');
if (!fs.existsSync(customTmpDir)) fs.mkdirSync(customTmpDir);

const handler = async (m, { conn, command, text, args, usedPrefix }) => {
  if (!text) {
    await conn.sendMessage(m.chat, { text: `✳️ Enter a song name. Example: *${usedPrefix + command}* sefali odia song` }, { quoted: m });
    return;
  }

  conn.ultra = conn.ultra || {};
  await conn.sendMessage(m.chat, { react: { text: '🎶', key: m.key } });

  const result = await searchAndDownloadMusic(text);
  if (!result.allLinks.length) {
    await conn.sendMessage(m.chat, { text: '❌ No results found for the search.' }, { quoted: m });
    return;
  }

  const infoText = `✦ ──『 *ULTRA PLAYER* 』── ⚝ \n\n🎵 Reply with a number to select a song:\n\n`;
  const orderedLinks = result.allLinks.map((link, index) => `*${index + 1}.* ${link.title}`).join('\n\n');
  const fullText = `${infoText}\n${orderedLinks}`;

  const { key } = await conn.sendMessage(m.chat, { text: fullText }, { quoted: m });

  conn.ultra[m.sender] = {
    result,
    key,
    timeout: setTimeout(() => {
      conn.sendMessage(m.chat, { delete: key });
      delete conn.ultra[m.sender];
    }, 150 * 1000),
  };
};

handler.before = async (m, { conn }) => {
  conn.ultra = conn.ultra || {};
  if (m.isBaileys || !(m.sender in conn.ultra)) return;

  const { result, key, timeout } = conn.ultra[m.sender];
  if (!m.quoted || m.quoted.id !== key.id || !m.text) return;

  const choice = parseInt(m.text.trim());
  if (choice < 1 || choice > result.allLinks.length) {
    await conn.sendMessage(m.chat, { text: `⚠️ Invalid choice. Choose a number between 1 and ${result.allLinks.length}.` }, { quoted: m });
    return;
  }

  const selectedUrl = result.allLinks[choice - 1].url;
  try {
    const response = await ytmp4(selectedUrl);
    if (!response || !response.video) throw new Error('No video URL found.');

    const videoUrl = response.video;
    const mediaResponse = await fetchWithRetry(videoUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json, text/plain, */*' },
    });

    const contentType = mediaResponse.headers.get('content-type');
    if (!contentType || !contentType.includes('video')) throw new Error('Invalid content type received');

    const mediaBuffer = Buffer.from(await mediaResponse.arrayBuffer());
    if (mediaBuffer.length === 0) throw new Error('Downloaded file is empty');

    // Save video temporarily
    const videoPath = path.join(customTmpDir, 'video.mp4');
    fs.writeFileSync(videoPath, mediaBuffer);

    // Convert to MP3
    const audioPath = path.join(customTmpDir, 'audio.mp3');
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .audioCodec('libmp3lame')
        .audioBitrate(128)
        .toFormat('mp3')
        .on('end', resolve)
        .on('error', reject)
        .save(audioPath);
    });

    // Ensure audio file exists
    if (!fs.existsSync(audioPath) || fs.statSync(audioPath).size === 0) throw new Error('Audio file is empty');

    const caption = `🎵 *Title:* ${response.title || 'Unknown'}\n👤 *Artist:* ${response.author || 'Unknown'}\n⏳ *Duration:* ${response.duration || 'Unknown'}\n👀 *Views:* ${response.views || '0'}\n📅 *Uploaded on:* ${response.upload || 'Unknown Date'}`;
    
    await conn.sendMessage(m.chat, { audio: fs.readFileSync(audioPath), mimetype: mime.lookup(audioPath) || 'audio/mpeg', caption }, { quoted: m });

    fs.unlinkSync(videoPath);
    fs.unlinkSync(audioPath);
  } catch (error) {
    console.error('Error fetching video:', error.message);
    await conn.sendMessage(m.chat, { text: '❌ An error occurred while fetching the video. Please try again later.' }, { quoted: m });
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }
};

handler.help = ['play'];
handler.tags = ['downloader'];
handler.command = ['play', 'song', 'spotify', 'playsong', 'ytplay'];

export default handler;

async function searchAndDownloadMusic(query) {
  try {
    const { videos } = await yts(query);
    if (!videos.length) return { allLinks: [] };

    return {
      title: videos[0].title,
      description: videos[0].description,
      duration: videos[0].duration,
      author: videos[0].author.name,
      allLinks: videos.map(video => ({ title: video.title, url: video.url })),
      videoUrl: videos[0].url,
      thumbnail: videos[0].thumbnail,
    };
  } catch (error) {
    console.error('Error:', error.message);
    return { allLinks: [] };
  }
}

async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const response = await fetch(url, options);
    if (response.ok) return response;
  }
  throw new Error('Failed to fetch media content after retries');
                           }
