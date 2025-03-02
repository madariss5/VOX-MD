const axios = require("axios");
const fetch = require("node-fetch");

module.exports = async (context) => {
    const { client, m, text } = context;

    let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : '';
    if (!teks) {
        await client.sendMessage(m.chat, { text: '✳️ Enter the name of the song' }, { quoted: m });
        return;
    }

    try {
        let res = await fetch(`https://some-random-api.com/lyrics?title=${encodeURIComponent(teks)}`);
        if (!res.ok) throw await res.text();

        let json = await res.json();
        if (!json.lyrics) {
            await client.sendMessage(m.chat, { text: '❌ Lyrics not found!' }, { quoted: m });
            return;
        }

        let caption = `🎶 *Lyrics Found!*\n\n📌 *Title:* ${json.title}\n👤 *Artist:* ${json.author}\n\n📜 *Lyrics:*\n${json.lyrics}`;
        
        if (json.thumbnail?.genius) {
            await client.sendMessage(m.chat, { image: { url: json.thumbnail.genius }, caption }, { quoted: m });
        } else {
            await client.sendMessage(m.chat, { text: caption }, { quoted: m });
        }

        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (e) {
        console.error('Error fetching lyrics:', e);

        await client.sendMessage(m.chat, { text: '⚠️ Error fetching lyrics. Please try again later.' }, { quoted: m });
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    }
};
