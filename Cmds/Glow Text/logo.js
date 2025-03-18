const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text } = context;

    if (!text) {
        return m.reply("❌ *Please provide a name for the logo!*\n\nExample usage:\n`.logo BlackPink`");
    }

    try {
        // Notify user that the process has started
        await client.sendMessage(m.chat, { 
            text: "🎨 *Generating your logo... Please wait!* ⏳" 
        });

        // Construct API URL
        const apiUrl = `https://api-pink-venom.vercel.app/api/logo?url=https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html&name=${encodeURIComponent(text)}`;

        // Fetch the image URL from the API
        const response = await axios.get(apiUrl);
        const imageUrl = response.data.url; // Ensure API returns { url: "image_link" }

        if (!imageUrl) {
            return m.reply("❌ *Failed to retrieve the logo. Please try again!*");
        }

        // Send the image
        await client.sendMessage(
            m.chat,
            {
                image: { url: imageUrl },
                caption: `🖼️ *Here is your generated logo for:* _${text}_`,
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("Logo generation error:", error.message);
        m.reply("❌ *Failed to generate the logo! Please try again later.*");
    }
};