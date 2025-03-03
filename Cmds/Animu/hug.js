const axios = require('axios');

module.exports = async (context) => {
    const { client, m } = context;

    try {
        // Fetch GIF from API
        const response = await axios.get('https://api.waifu.pics/sfw/hug');
        const gifUrl = response.data.url; 

        // Get mentioned user or quoted user
        let mentionedUser = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null);

        let messageText = "";
        let mentionedJid = [];

        if (mentionedUser) {
            const mentionedName = await client.getName(mentionedUser);
            messageText = `🤗 *${m.pushName}* gives a big hug to *@${mentionedUser.split("@")[0]}*! 💖`;
            mentionedJid.push(mentionedUser); // Tagging the user
        } else {
            messageText = `🤗 *${m.pushName}* hugs themselves! 🤍`;
        }

        // Fetch GIF as a buffer
        const gifBuffer = await axios.get(gifUrl, { responseType: "arraybuffer" });

        // Send as GIF (video)
        await client.sendMessage(m.chat, {
            video: gifBuffer.data,
            caption: messageText,
            gifPlayback: true, // Enables looping animation
            mentions: mentionedJid // Ensures the tagged user is notified
        }, { quoted: m });

    } catch (error) {
        console.error("Error fetching hug GIF:", error);
        m.reply("❌ Failed to fetch hug GIF. Please try again later!");
    }
};
