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

        // Send hug GIF with caption
        await client.sendMessage(m.chat, {
            video: { url: hugGifUrl }, // Changed to "video" for GIF support
            caption: messageText,
            gifPlayback: true // Enables GIF playback
        }, { quoted: m });

    } catch (error) {
        console.error("Error fetching hug GIF:", error);
        m.reply("❌ Failed to fetch hug GIF. Please try again later!");
    }
};
