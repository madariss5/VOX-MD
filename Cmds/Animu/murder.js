const axios = require('axios');

module.exports = async (context) => {
    const { client, m, parseMention } = context;

    try {
        // Fetch kill image from API
        const response = await axios.get('https://api.waifu.pics/sfw/kill');
        const killImageUrl = response.data.url;

        // Get mentioned user or quoted user
        let mentionedUser = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null);
        
        let messageText = "";
        let mentionedJid = [];

        if (mentionedUser) {
            messageText = `💀 *${m.pushName}* just eliminated *@${mentionedUser.split("@")[0]}*... RIP! ⚰️`;
            mentionedJid.push(mentionedUser);
        } else {
            messageText = `💀 *${m.pushName}* has self-destructed! 💥`;
        }

        // Send image with caption
        await client.sendMessage(m.chat, {
            image: { url: killImageUrl },
            caption: messageText,
            mentions: mentionedJid
        }, { quoted: m });

    } catch (error) {
        console.error("Error fetching kill image:", error);
        m.reply("❌ Failed to fetch kill image. Please try again later!");
    }
};
