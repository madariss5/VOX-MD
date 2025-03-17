const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) return m.reply("❌ Please provide a prompt. Example: _-flux dog_");

    let apiUrl = `https://apis.davidcyriltech.my.id/flux?prompt=${text}`;

    await m.reply("🎨 *Generating Flux AI image... Please wait...*");

    try {
        let { data } = await axios.get(apiUrl);

        if (!data || !data.url) {
            return m.reply("⚠️ No image generated. Try a different prompt.");
        }

        await client.sendMessage(
            m.chat,
            {
                image: { url: data.url },
                caption: `🖼️ *Flux AI Image Generated* \n🔍 *Prompt:* ${text}\n🚀 *Powered by Flux AI*`
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("Flux API Error:", error.message);
        m.reply("❌ Failed to generate the image. Please try again later.");
    }
};