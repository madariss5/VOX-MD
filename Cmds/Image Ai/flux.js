const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) {
        return m.reply("❌ *Please provide an image prompt!*\n\nExample usage:\n`.flux dog`");
    }

    try {
        // Notify user that the process has started
        await client.sendMessage(m.chat, { 
            text: "🎨 *Generating your AI image... Please wait!* ⏳" 
        });

        // Construct API URL
        const apiUrl = `https://apis.davidcyriltech.my.id/flux?prompt=${encodeURIComponent(text)}`;

        // Send the generated image
        await client.sendMessage(
            m.chat,
            {
                image: { url: apiUrl },
                caption: `🖼️ *Here is your AI-generated image for:* _${text}_`,
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("Flux image error:", error.message);
        m.reply("❌ *Failed to generate the AI image! Please try again later.*");
    }
};