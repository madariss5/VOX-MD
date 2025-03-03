const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : '';
    if (!teks) {
        await client.sendMessage(m.chat, { 
            text: `✳️ *Enter the name of the song!*\n\n🔎 Example: *!lyrics Shape of You*`, 
            footer: "🚀 Powered by VOX-MD",
            quoted: m 
        });
        return;
    }

    // Send a "Please wait..." message before fetching the lyrics
    await m.reply("⏳ *Please wait...* Fetching song lyrics...");

    try {
        let { data } = await axios.get(`https://fastrestapis.fasturl.cloud/music/songlyrics-v2?name=${encodeURIComponent(teks)}`);

        if (data.status !== 200 || !data.result || !data.result.lyrics) {
            await client.sendMessage(m.chat, { 
                text: `❌ *Lyrics not found!*\n\n💡 Try searching for another song.`, 
                footer: "🎵 VOX-MD Music", 
                quoted: m 
            });
            return;
        }

        let { title, artist, lyrics, thumbnail } = data.result;

        // Ensure lyrics are properly formatted
        let formattedLyrics = typeof lyrics === 'object' ? Object.values(lyrics).join("\n") : lyrics;

        let caption = `🎶 *Lyrics Found!*\n\n📌 *Title:* _${title}_\n👤 *Artist:* _${artist}_\n\n📜 *Lyrics:*\n${formattedLyrics}\n\n⚡ _Powered by VOX-MD_`;

        if (thumbnail) {
            await client.sendMessage(m.chat, { 
                image: { url: thumbnail }, 
                caption 
            }, { quoted: m });
        } else {
            await client.sendMessage(m.chat, { text: caption, quoted: m });
        }

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
