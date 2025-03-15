module.exports = async (context) => {
    const { client, m, text, botname, fetchJson } = context;

    if (!text) return m.reply("Provide a song name to download.\nExample: `.play Alan Walker Faded`");

    try {
        const data = await fetchJson(`https://fastrestapis.fasturl.cloud/downup/ytmp3?url=https://www.youtube.com/results?search_query=${encodeURIComponent(text)}&quality=128kbps`);

        if (!data || data.status !== 200 || !data.result || !data.result.media) {
            return m.reply("❌ Sorry, couldn't fetch the song. Try another one.");
        }

        const audioUrl = data.result.media;

        await client.sendMessage(m.chat, {
            document: { url: audioUrl },
            mimetype: "audio/mpeg",
            fileName: `${text}.mp3`,
            caption: `🎵 Downloaded by ${botname}`
        }, { quoted: m });

    } catch (e) {
        m.reply("❌ An error occurred. API might be down.\n" + e);
    }
};