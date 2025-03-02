module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    try {
        if (!text) return m.reply("🎵 *Please enter a song name to download!*");

        let data = await fetchJson(`https://gtech-api-xtp1.onrender.com/api/search/itunes?apikey=APIKEY&name=${encodeURIComponent(text)}`);

        if (!data || !data.result || !data.result[0]) {
            return m.reply("❌ *No songs found!*");
        }

        const { trackName: title, previewUrl: audioUrl, artistName: author } = data.result[0];

        await m.reply(`🎶 *Downloading:* ${title}\n🎤 *Artist:* ${author}`);

        await client.sendMessage(
            m.chat,
            {
                document: { url: audioUrl },
                mimetype: "audio/mpeg",
                fileName: `${title}.mp3`,
            },
            { quoted: m }
        );

    } catch (error) {
        console.error("API Error:", error.message);
        m.reply("❌ *Download failed: Unable to retrieve audio.*");
    }
};
