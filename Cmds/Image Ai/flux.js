const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) return m.reply("❌ Please provide a prompt. Example: _-flux dog_");

    let apiUrl = `https://apis.davidcyriltech.my.id/flux?prompt=${text}`;

    await m.reply("🎨 *Generating Flux AI image... Please wait...*");

    try {
        let response = await axios.get(apiUrl);

        console.log("API Response:", response.data); // Debugging log

        if (!response.data || !response.data.url) {
            return m.reply("⚠️ No image generated. The API response is invalid or empty.");
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
        console.error("Flux API Error:", error); // Full error details
        m.reply("❌ Failed to generate the image. The API might be down or returning an invalid response.");
    }
};