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

    // Send "Please wait..." message before fetching
    await m.reply("⏳ *Please wait...* Fetching song lyrics...");

    try {
        // Extract song name and artist (if provided)
        let [songTitle, artist] = teks.split("|").map(t => t.trim());
        if (!artist) artist = ""; // If no artist is provided, keep it empty

        let apiUrl = `https://apis.davidcyriltech.my.id/lyrics2?t=${encodeURIComponent(songTitle)}&a=${encodeURIComponent(artist)}`;

        let { data } = await axios.get(apiUrl);

        if (data.status !== 200 || !data.result || !data.result.lyrics) {
            await client.sendMessage(m.chat, { 
                text: `❌ *Lyrics not found!*\n\n💡 Try searching for another song.`, 
                footer: "🎵 VOX-MD Music", 
                quoted: m 
            });
            return;
        }

        let { title, artist: songArtist, lyrics, thumbnail } = data.result;

        // **Fix: Convert lyrics from objects to text**
        let formattedLyrics = "";
        if (Array.isArray(lyrics)) {
            formattedLyrics = lyrics.map(line => line.text || "").join("\n");
        } else if (typeof lyrics === "object") {
            formattedLyrics = Object.values(lyrics).map(line => line.text || "").join("\n");
        } else {
            formattedLyrics = lyrics; // Use as is if already a string
        }

        let caption = `🎶 *Lyrics Found!*\n\n📌 *Title:* _${title}_\n👤 *Artist:* _${songArtist}_\n\n📜 *Lyrics:*\n${formattedLyrics}\n\n⚡ _Powered by VOX-MD_`;

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