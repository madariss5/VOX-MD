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
        console.log("API Full Response:", JSON.stringify(response.data, null, 2)); // Debugging

        // Check if lyrics exist in "plainLyrics"
        if (!response.data || !response.data.result || response.data.result.length === 0) {
            return m.reply("❌ *Lyrics not found!*\n\n💡 Try searching for another song.");
        }

        let songData = response.data.result[0]; // Get the first result
        let { trackName, artistName, plainLyrics } = songData;

        if (!plainLyrics) {
            return m.reply("❌ *Lyrics not found!*\n\n💡 Try searching for another song.");
        }

        // **LOG THE EXACT LYRICS BEFORE SENDING**
        console.log("Extracted Lyrics:", plainLyrics);

        // Format lyrics properly
        let formattedLyrics = plainLyrics.replace(/\\n/g, "\n").trim();

        // WhatsApp message limit is ~4096 characters, so split long lyrics
        const MAX_MESSAGE_LENGTH = 4000;
        let messages = [];

        while (formattedLyrics.length > 0) {
            messages.push(formattedLyrics.substring(0, MAX_MESSAGE_LENGTH));
            formattedLyrics = formattedLyrics.substring(MAX_MESSAGE_LENGTH);
        }

        // Send lyrics in chunks
        await client.sendMessage(m.chat, { text: `🎶 *Lyrics Found!*\n\n📌 *Title:* _${trackName}_\n👤 *Artist:* _${artistName}_\n\n📜 *Lyrics:*` }, { quoted: m });

        for (let msg of messages) {
            console.log("Sending chunk:", msg); // **DEBUG EACH MESSAGE SENT**
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