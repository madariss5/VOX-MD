const fetch = require("node-fetch");

module.exports = async (context) => {
    const { client, m, text, fetchJson } = context;

    if (!text) {
        return m.reply("⚠️ Provide some text for AI image generation.\n\nExample:\n`.text2img anime girl, cyberpunk style, futuristic background`");
    }

    try {
        // Fetch API response
        const url = `https://api.ryzendesu.vip/api/ai/text2img?prompt=${encodeURIComponent(text)}`;
        const data = await fetchJson(url);

        console.log("Full API Response:", data); // Log full response for debugging

        // Validate API response
        if (data && data.data && data.data.image) {
            const imageUrl = data.data.image;

            // Send image response
            await client.sendMessage(m.chat, { 
                image: { url: imageUrl }, 
                caption: `✅ *AI Image Generated Successfully!*\n\n🖌️ *Prompt:* ${text}`
            }, { quoted: m });

        } else {
            m.reply("❌ API Error: No image generated.\n\n🔍 Debug Info:\n" + JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("Error in text2img.js:", error);
        m.reply(`❌ Something went wrong...\n\nError: ${error.message || error}`);
    }
};
