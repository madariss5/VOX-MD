const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) {
        return m.reply("❌ *Please provide a song title and artist!*\n\nExample usage:\n`.lyrics Faded - Alan Walker`");
    }

    try {
        // Notify user that lyrics are being fetched
        await client.sendMessage(m.chat, { 
            text: "🎵 *Fetching song lyrics... Please wait!* ⏳" 
        });

        // Extract title and artist from text
        let [title, artist] = text.split(" - ");
        if (!artist) {
            return m.reply("⚠️ *Please provide both song title and artist!*\n\nExample:\n`.lyrics Faded - Alan Walker`");
        }

        // Construct API URL
        const apiUrl = `https://apis.davidcyriltech.my.id/lyrics2?t=${encodeURIComponent(title)}&a=${encodeURIComponent(artist)}`;

        // Fetch lyrics
        const { data } = await axios.get(apiUrl);

        if (data.status !== 200 || !data.lyrics) {
            return m.reply("❌ *Lyrics not found!*\n\n💡 Try searching for another song.");
        }

        let { title: songTitle, artist: songArtist, lyrics } = data;

        // Format lyrics properly
        let formattedLyrics = lyrics
            .replace(/&gt;/g, ">")
            .replace(/\\n/g, "\n")
            .trim();

        // Send lyrics response
        await client.sendMessage(
            m.chat,
            {
                text: `🎶 *Lyrics Found!*\n\n📌 *Title:* _${songTitle}_\n👤 *Artist:* _${songArtist}_\n\n📜 *Lyrics:*\n${formattedLyrics}\n\n⚡ _Powered by VOX-MD_`,
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("Lyrics fetch error:", error.message);
        m.reply("❌ *Failed to fetch lyrics! Please try again later.*");
    }
};