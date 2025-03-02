const axios = require("axios");
const fetch = require("node-fetch");

module.exports = async (context) => {
    const { client, m, text } = context;

    let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : '';
    if (!teks) throw '✳️ Enter the name of the song';

    try {
        let res = await fetch(`https://some-random-api.com/lyrics?title=${encodeURIComponent(teks)}`);
        if (!res.ok) throw await res.text();

        let json = await res.json();
        if (!json.lyrics) throw '❌ Lyrics not found!';

        await client.sendFile(
            m.chat,
            json.thumbnail.genius || '',
            null,
            `▢ *${json.title}*\n*${json.author}*\n\n${json.lyrics}`,
            m
        );

        m.react('✅');
    } catch (e) {
        console.error('Error fetching lyrics:', e);
        m.react('❌');
    }
};
