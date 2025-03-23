const axios = require("axios");

module.exports = async (context) => {
    const { client, m, quoted } = context;

    if (!quoted || !quoted.imageMessage) {
        return m.reply("❌ *Please reply to an image to remove its background!*\n\nExample usage:\n`.removebg` (while replying to an image)");
    }

    try {
        // Notify user that the process has started
        await client.sendMessage(m.chat, { 
            text: "🖼️ *Removing background... Please wait!* ⏳" 
        });

        // Get the image URL
        const imageUrl = await client.downloadMediaMessage(quoted);

        // Construct API URL
        const apiUrl = `https://fastrestapis.fasturl.cloud/aiimage/removebg?imageUrl=${encodeURIComponent(imageUrl)}&type=auto&shadow=false`;

        // Fetch the processed image
        const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

        // Send the processed image
        await client.sendMessage(
            m.chat,
            {
                image: response.data,
                mimetype: "image/png",
                caption: "✅ *Here is your image with the background removed!*",
            },
            { quoted: m }
        );
    } catch (error) {
        console.error("Remove BG error:", error.message);
        m.reply("❌ *Failed to remove the background! Please try again later.*");
    }
};