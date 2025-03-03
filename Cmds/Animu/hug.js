const axios = require('axios');

module.exports = async (context) => {
    const { client, m, args } = context;

    try {
        // Fetch hug GIF from API
        const response = await axios.get('https://api.waifu.pics/sfw/hug');
        const hugGifUrl = response.data.url; // API returns a GIF URL

        // Get mentioned user
        const mentionedUser = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0]);
        const sender = m.sender;

        // Format message
        let messageText = "";
        if (mentionedUser) {
            const mentionedName = await client.getName(mentionedUser);
            messageText = `🤗 *${m.pushName}* gives a big hug to *${mentionedName}*! 💖`;
        } else {
            messageText = `🤗 *${m.pushName}* hugs themselves! 🤍`;
        }

        // Download the GIF to a buffer (ensures proper format)
        const gifBuffer = await axios.get(hugGifUrl, { responseType: "arraybuffer" });

        // Send hug GIF with caption
        await client.sendMessage(m.chat, {
            video: gifBuffer.data, // Send as video buffer
            caption: messageText,
            gifPlayback: true // Ensures looping GIF
        }, { quoted: m });

    } catch (error) {
        console.error("Error fetching hug GIF:", error);
        m.reply("❌ Failed to fetch hug GIF. Please try again later!");
    }
};
