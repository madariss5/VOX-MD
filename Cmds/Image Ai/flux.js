const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) return m.reply("❌ Please provide a prompt. Example: _-flux dog_");

    let apiUrl = `https://apis.davidcyriltech.my.id/flux?prompt=${text}`;

    await m.reply("🎨 *Generating Flux AI image... Please wait...*");

    try {
        let response = await axios.get(apiUrl);

        if (!response.data || !response.data.url) {
            return m.reply("⚠️ No image generated. The API may be down or the prompt is invalid.");
        }

        await client.sendMessage(
            m.chat,
            {
                image: { url: response.data.url },
                caption: `🖼️ *Flux AI Image Generated* \n🔍 *Prompt:* ${text}\n🚀 *Powered by Flux AI*`
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("Flux API Error:", error.message);
        m.reply("❌ Failed to generate the image. The API may be down.");
    }
};