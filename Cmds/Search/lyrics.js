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

        // Construct API URL using the full text input
        const query = encodeURIComponent(text.trim());
        const apiUrl = `https://apidl.asepharyana.cloud/api/search/lyrics?query=${query}`;

        console.log("Requesting URL:", apiUrl); // Debugging

        // Fetch lyrics
        const response = await axios.get(apiUrl);
        console.log("API Response:", response.data); // Debugging

        // Ensure response structure is correct
        if (!response.data || !response.data.result || response.data.result.length === 0) {
            return m.reply("❌ *Lyrics not found!*\n\n💡 Try searching for another song.");
        }

        let songData = response.data.result[0]; // Assuming API returns an array of results
        let { title, artist, lyrics } = songData;

        // Format lyrics properly
        let formattedLyrics = lyrics
            .replace(/&gt;/g, ">")
            .replace(/\\n/g, "\n")
            .trim();

        if (!formattedLyrics) {
            return m.reply("❌ *Lyrics not found!*\n\n💡 Try searching for another song.");
        }

        // Send lyrics response
        await client.sendMessage(
            m.chat,
            {
                text: `🎶 *Lyrics Found!*\n\n📌 *Title:* _${title}_\n👤 *Artist:* _${artist}_\n\n📜 *Lyrics:*\n${formattedLyrics}\n\n⚡ _Powered by VOX-MD_`,
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("Lyrics fetch error:", error);

        // Handle API errors
        if (error.response) {
            console.error("API Error Response:", error.response.data);
            return m.reply(`❌ *Error fetching lyrics!*\n\n📌 *API Error:* ${error.response.data.message || "Unknown error"}`);
        } else {
            return m.reply("❌ *Failed to fetch lyrics! Please try again later.*");
        }
    }
};