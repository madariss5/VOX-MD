const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) return m.reply("❌ *Provide a song name!*");

    try {
        const response = await axios.get(`https://api.ryzendesu.vip/api/search/lyrics?query=${encodeURIComponent(text)}`);

        if (response.data && response.data.lyrics) {
            const lyrics = response.data.lyrics;

            // Trimming long lyrics to prevent WhatsApp message limit issues
            const maxLength = 4000; // WhatsApp limit
            const formattedLyrics = lyrics.length > maxLength ? lyrics.substring(0, maxLength) + "...\n\n🔗 *Lyrics too long?* Try searching online!" : lyrics;

            await client.sendMessage(m.chat, { text: `🎶 *Lyrics for:* _${text}_\n\n${formattedLyrics}` }, { quoted: m });
        } else {
            m.reply(`❌ *No lyrics found for:* _${text}_`);
        }
    } catch (error) {
        console.error("Error fetching lyrics:", error);
        m.reply("⚠️ *Error fetching lyrics. Try again later!*");
    }
};
