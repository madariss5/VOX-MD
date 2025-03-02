const axios = require('axios');

module.exports = async (context) => {
    const { client, m, args } = context;

    try {
        // Fetch hug GIF from API
        const response = await axios.get('https://some-random-api.com/animu/hug');
        const hugGifUrl = response.data.link;

        // Get mentioned user
        const mentionedUser = m.quoted ? m.quoted.sender : m.mentionedJid[0];
        const sender = m.sender;

        // Format message
        let messageText = "";
        if (mentionedUser) {
            messageText = `🤗 *${m.pushName}* gives a big hug to *${await client.getName(mentionedUser)}*! 💖`;
        } else {
            messageText = `🤗 *${m.pushName}* hugs themselves! 🤍`;
        }

        // Send hug GIF with caption
        await client.sendMessage(m.chat, {
            image: { url: hugGifUrl },
            caption: messageText,
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        m.reply("❌ Failed to fetch hug GIF. Please try again later!");
    }
};
