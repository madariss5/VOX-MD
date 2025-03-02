const fetch = require("node-fetch");

module.exports = async (client, m, text) => {
    try {
        let text = args.join(" ");
        if (!text) {
            return m.reply("⚠️ *Provide a prompt for image generation!*\n\nExample:\n`.text2img anime girl with pink hair`");
        }

        await m.reply("⏳ *Generating AI image... Please wait.*");

        const apiUrl = `https://api.ryzendesu.vip/api/ai/text2img?prompt=${encodeURIComponent(text)}`;

        let response = await fetch(apiUrl);
        let imageBuffer = await response.buffer();

        await client.sendMessage(m.chat, { image: imageBuffer, caption: "✨ *AI-Generated Image* ✨" }, { quoted: m });

    } catch (error) {
        console.error(error);
        m.reply("⚠️ *Failed to generate AI image.*\nPlease try again later.");
    }
};
