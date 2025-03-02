const fetch = require("node-fetch");

module.exports = async (context) => {
    const { client, m, text } = context;

    // Modern Header
    const header = `╔══ ✨ *AI IMAGE GENERATOR* ✨ ══╗`;

    // Footer with branding & author
    const footer = `\n━━━━━━━━━━━━━━\n🔹 *Powered by:* 𝑽𝑶𝑿-𝑴𝑫\n👑 *Author:* 𝗞𝗔𝗡𝗔𝗠𝗕𝗢\n━━━━━━━━━━━━━━`;

    // If no prompt is provided
    if (!text) {
        let usageMessage = `${header}\n\n📝 *How to Use:*\n➤ _Type:_ *.txt1img <prompt>*\n📌 *Example:*\n.txt2img anime girl, pink hair, futuristic cyber world\n${footer}`;
        await client.sendMessage(m.chat, { text: usageMessage }, { quoted: m });
        return;
    }

    // Processing message
    let processingMessage = `🎨 *Generating Your AI Image...*\n⏳ *Please wait a moment!*`;
    await client.sendMessage(m.chat, { text: processingMessage }, { quoted: m });

    try {
        const apiUrl = `https://api.ryzendesu.vip/api/ai/text2img?prompt=${encodeURIComponent(text)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) throw new Error("Failed to fetch AI image.");
        const imageBuffer = await response.buffer();

        // Send generated image with modern styling
        let caption = `✨ *Here is your AI-generated image!* ✨\n\n🎨 *Prompt:* ${text}${footer}`;
        await client.sendMessage(m.chat, {
            image: imageBuffer,
            caption: caption
        }, { quoted: m });

        // React with success emoji
        await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error("AI Image Generation Error:", error);
        let errorMessage = `❌ *Oops! Image generation failed.*\n🔄 _Please try again later._\n${footer}`;
        await client.sendMessage(m.chat, { text: errorMessage }, { quoted: m });
        await client.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    }
};
