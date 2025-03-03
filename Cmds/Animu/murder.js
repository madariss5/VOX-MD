const axios = require('axios');

module.exports = async (context) => {
    const { client, m, args } = context;

    try {
        // Fetch GIF from API
        const response = await axios.get('https://api.waifu.pics/sfw/hug');
        const gifUrl = response.data.url; 

        // Get mentioned user
        const mentionedUser = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0]);
        let messageText = "";

        if (mentionedUser) {
            const mentionedName = await client.getName(mentionedUser);
            messageText = `🤗 *${m.pushName}* gives a big hug to *${mentionedName}*! 💖`;
        } else {
            messageText = `🤗 *${m.pushName}* hugs themselves! 🤍`;
        }

        // Fetch GIF as a buffer
        const gifBuffer = await axios.get(gifUrl, { responseType: "arraybuffer" });

        // Send as GIF (video)
        await client.sendMessage(m.chat, {
            video: gifBuffer.data, // Send as video
            caption: messageText,
            gifPlayback: true // Enables looping animation
        }, { quoted: m });

    } catch (error) {
        console.error("Error fetching hug GIF:", error);
        m.reply("❌ Failed to fetch hug GIF. Please try again later!");
    }
};
