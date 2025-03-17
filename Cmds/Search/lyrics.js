const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : '';
    if (!teks) {
        await client.sendMessage(m.chat, { 
            text: `✳️ *Enter the song name!*\n\n🔎 Example: *.lyrics Faded Alan Walker*`, 
            footer: "🚀 Powered by VOX-MD",
            quoted: m 
        });
        return;
    }

    // Notify the user that lyrics are being fetched
    await m.reply("⏳ *Fetching song lyrics...*");

    try {
        let apiUrl = `https://apis.davidcyriltech.my.id/lyrics2?t=${encodeURIComponent(teks)}`;

        let { data } = await axios.get(apiUrl);

        if (data.status !== 200 || !data.lyrics) {
            await client.sendMessage(m.chat, { 
                text: `❌ *Lyrics not found!*\n\n💡 Try searching for another song.`, 
                footer: "🎵 VOX-MD Music", 
                quoted: m 
            });
            return;
        }

        let { title, artist, lyrics } = data;

        // **Fix lyrics formatting**
        let formattedLyrics = lyrics
            .replace(/&gt;/g, ">") // Fix encoded characters
            .replace(/\\n/g, "\n") // Convert new lines
            .trim();

        let caption = `🎶 *Lyrics Found!*\n\n📌 *Title:* _${title}_\n👤 *Artist:* _${artist}_\n\n📜 *Lyrics:*\n${formattedLyrics}\n\n⚡ _Powered by VOX-MD_`;

        await client.sendMessage(m.chat, { text: caption, quoted: m });

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error('Error fetching lyrics:', e);

        await client.sendMessage(m.chat, { 
            text: `⚠️ *Error fetching lyrics!*\n\nPlease try again later.`, 
            footer: "🚀 VOX-MD Support", 
            quoted: m 
        });
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    }
};