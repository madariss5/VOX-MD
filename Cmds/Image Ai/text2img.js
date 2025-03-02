const fetch = require("node-fetch");

module.exports = async (client, m, text) => {
    try {
        if (!m || !m.chat) {
            console.error("❌ Error: 'm' is undefined or missing 'chat'.");
            return;
        }

        if (!text) {
            return client.sendMessage(m.chat, { text: "⚠️ *Provide a prompt for image generation!*\n\nExample:\n`.text2img anime girl with pink hair`" }, { quoted: m });
        }

        await client.sendMessage(m.chat, { text: "⏳ *Generating AI image... Please wait.*" }, { quoted: m });

        const apiUrl = `https://api.ryzendesu.vip/api/ai/text2img?prompt=${encodeURIComponent(text)}`;

        let response = await fetch(apiUrl);
        let imageBuffer = await response.buffer();

        await client.sendMessage(m.chat, { image: imageBuffer, caption: "✨ *AI-Generated Image* ✨" }, { quoted: m });

    } catch (error) {
        console.error(error);
        client.sendMessage(m.chat, { text: "⚠️ *Failed to generate AI image.*\nPlease try again later." }, { quoted: m });
    }
};
