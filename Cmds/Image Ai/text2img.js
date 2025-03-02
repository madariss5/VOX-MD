const axios = require('axios');

module.exports = async (context) => {
    const { client, m, args } = context;

    try {
        const prompt = args.join(" ") || "anime girl"; // Default prompt
        const apiUrl = `https://api.ryzendesu.vip/api/ai/text2img?prompt=${encodeURIComponent(prompt)}`;

        console.log(`Requesting: ${apiUrl}`);

        const response = await axios.get(apiUrl);
        if (response.status !== 200) throw new Error(`API Error: ${response.status}`);

        const imageUrl = response.data; // Ensure this matches the actual API response structure
        console.log(`Image URL: ${imageUrl}`);

        await client.sendMessage(m.chat, {
            image: { url: imageUrl },
            caption: `🖼️ *AI-Generated Image*\nPrompt: ${prompt}`
        }, { quoted: m });

    } catch (error) {
        console.error("Error in text2img:", error);
        m.reply("❌ Failed to generate image. Check logs for details.");
    }
};
