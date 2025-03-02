const axios = require("axios");
const fetch = require("node-fetch");

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

    try {
        let res = await fetch(`https://some-random-api.com/lyrics?title=${encodeURIComponent(teks)}`);
        if (!res.ok) throw await res.text();

        let json = await res.json();
        if (!json.lyrics) {
            await client.sendMessage(m.chat, { 
                text: `❌ *Lyrics not found!*\n\n💡 Try searching for another song.`, 
                footer: "🎵 VOX-MD Music", 
                quoted: m 
            });
            return;
        }

        let caption = `🎶 *Lyrics Found!*\n\n📌 *Title:* _${json.title}_\n👤 *Artist:* _${json.author}_\n\n📜 *Lyrics:*\n${json.lyrics}\n\n⚡ _Powered by VOX-MD_`;

        if (json.thumbnail?.genius) {
            await client.sendMessage(m.chat, { 
                image: { url: json.thumbnail.genius }, 
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
