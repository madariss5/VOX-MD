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

        // Construct API URL
        const query = encodeURIComponent(text.trim());
        const apiUrl = `https://apidl.asepharyana.cloud/api/search/lyrics?query=${query}`;

        console.log("Requesting URL:", apiUrl); // Debugging

        // Fetch lyrics
        const response = await axios.get(apiUrl);
        console.log("API Full Response:", JSON.stringify(response.data, null, 2)); // Full API response for debugging

        // Check if lyrics exist
        if (!response.data || !response.data.result || response.data.result.length === 0) {
            return m.reply("❌ *Lyrics not found!*\n\n💡 Try searching for another song.");
        }

        let songData = response.data.result[0]; // Assuming first result is the best match
        let { title, artist, lyrics } = songData;

        if (!lyrics) {
            return m.reply("❌ *Lyrics not found!*\n\n💡 Try searching for another song.");
        }

        // Format lyrics
        let formattedLyrics = lyrics.replace(/&gt;/g, ">").replace(/\\n/g, "\n").trim();

        // WhatsApp message limit is ~4096 characters, so split long lyrics
        const MAX_MESSAGE_LENGTH = 4000;
        let messages = [];

        while (formattedLyrics.length > 0) {
            messages.push(formattedLyrics.substring(0, MAX_MESSAGE_LENGTH));
            formattedLyrics = formattedLyrics.substring(MAX_MESSAGE_LENGTH);
        }

        // Send lyrics in chunks
        await client.sendMessage(m.chat, { text: `🎶 *Lyrics Found!*\n\n📌 *Title:* _${title}_\n👤 *Artist:* _${artist}_\n\n📜 *Lyrics:*` }, { quoted: m });

        for (let msg of messages) {
            await client.sendMessage(m.chat, { text: msg });
        }

    } catch (error) {
        console.error("Lyrics fetch error:", error);

        if (error.response) {
            console.error("API Error Response:", JSON.stringify(error.response.data, null, 2));
            return m.reply(`❌ *Error fetching lyrics!*\n\n📌 *API Error:* ${error.response.data.message || "Unknown error"}`);
        } else {
            return m.reply("❌ *Failed to fetch lyrics! Please try again later.*");
        }
    }
};