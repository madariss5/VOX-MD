const axios = require('axios');

module.exports = async (context) => {
    const { client, m } = context;

    try {
        // Fetch image from API
        const response = await axios.get('https://api.waifu.pics/sfw/hug');
        const hugImageUrl = response.data.url;

        // Get mentioned or quoted user
        let mentionedUser = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null);

        let messageText = "";
        let mentionedJid = [];

        if (mentionedUser) {
            const mentionedName = await client.fetchName(mentionedUser); // FIXED getName issue
            messageText = `🤗 *${m.pushName}* gives a big hug to *@${mentionedUser.split("@")[0]}*! 💖`;
            mentionedJid.push(mentionedUser);
        } else {
            messageText = `🤗 *${m.pushName}* hugs themselves! 🤍`;
        }

        // Send image with caption
        await client.sendMessage(m.chat, {
            image: { url: hugImageUrl },
            caption: messageText,
            mentions: mentionedJid
        }, { quoted: m });

    } catch (error) {
        console.error("Error fetching hug image:", error);
        m.reply("❌ Failed to fetch hug image. Please try again later!");
    }
};
