const axios = require('axios');

module.exports = async (context) => {
    const { client, m, parseMention } = context;

    try {
        // Fetch pat image from API
        const response = await axios.get('https://api.waifu.pics/sfw/pat');
        const patImageUrl = response.data.url;

        // Get mentioned user or quoted user
        let mentionedUser = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null);
        
        let messageText = "";
        let mentionedJid = [];

        if (mentionedUser) {
            messageText = `✨ *${m.pushName}* pats *@${mentionedUser.split("@")[0]}* gently! 💕`;
            mentionedJid.push(mentionedUser);
        } else {
            messageText = `✨ *${m.pushName}* pats themselves! 🥰`;
        }

        // Send image with caption
        await client.sendMessage(m.chat, {
            image: { url: patImageUrl },
            caption: messageText,
            mentions: mentionedJid
        }, { quoted: m });

    } catch (error) {
        console.error("Error fetching pat image:", error);
        m.reply("❌ Failed to fetch pat image. Please try again later!");
    }
};
