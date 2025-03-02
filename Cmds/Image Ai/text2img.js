const axios = require('axios');

module.exports = async (context) => {
    const { client, m, args } = context;

    try {
        // Validate input
        if (!args.length) {
            return m.reply("❌ Please provide a prompt!\n\nExample: `.text2img A cyberpunk warrior with neon lights`");
        }

        const prompt = args.join(" ");
        const apiUrl = `https://api.ryzendesu.vip/api/ai/text2img?prompt=${encodeURIComponent(prompt)}`;

        // Fetch image from the API
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, "binary");

        // Send generated image
        await client.sendMessage(m.chat, {
            image: imageBuffer,
            caption: `✨ *AI-Generated Image*\n🎨 *Prompt:* ${prompt}`,
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        m.reply("❌ Failed to generate an image. Please try again later!");
    }
};
