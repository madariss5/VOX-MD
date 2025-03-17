const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) {
        return m.reply("❌ *Please provide a song title and artist!*\n\nExample usage:\n`.lyrics Faded Alan Walker`");
    }

    try {
        // Notify user that lyrics are being fetched
        await client.sendMessage(m.chat, { 
            text: "🎵 *Fetching song lyrics... Please wait!* ⏳" 
        });

        // Construct API URL
        const apiUrl = `https://apis.davidcyriltech.my.id/lyrics2?t=${encodeURIComponent(text)}`;

        // Fetch lyrics
        const { data } = await axios.get(apiUrl);

        if (data.status !== 200 || !data.lyrics) {
            return m.reply("❌ *Lyrics not found!*\n\n💡 Try searching for another song.");
        }

        let { title, artist, lyrics } = data;

        // Fix lyrics formatting
        let formattedLyrics = lyrics
            .replace(/&gt;/g, ">") // Fix encoded characters
            .replace(/\\n/g, "\n") // Convert new lines
            .trim();

        // Send lyrics response
        await client.sendMessage(
            m.chat,
            {
                text: `🎶 *Lyrics Found!*\n\n📌 *Title:* _${title}_\n👤 *Artist:* _${artist}_\n\n📜 *Lyrics:*\n${formattedLyrics}\n\n⚡ _Powered by VOX-MD_`,
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("Lyrics fetch error:", error.message);
        m.reply("❌ *Failed to fetch lyrics! Please try again later.*");
    }
};