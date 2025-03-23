const axios = require("axios");

module.exports = async (context) => {
    const { client, m, mime, text } = context;

    // Ensure user sends an image with the caption `.removebg`
    if (!m.hasMedia || !mime.startsWith("image/")) {
        return m.reply("❌ *Please send an image with the caption `.removebg` to remove its background!*");
    }

    try {
        // Notify the user that the process has started
        await client.sendMessage(m.chat, { 
            text: "🖼️ *Removing background... Please wait!* ⏳" 
        });

        // Download the image
        const media = await m.downloadMediaMessage();

        // Convert image to base64
        const base64Image = media.toString("base64");

        // API request
        const apiUrl = `https://fastrestapis.fasturl.cloud/aiimage/removebg?type=auto&shadow=false`;
        const response = await axios.post(apiUrl, { image: base64Image }, {
            headers: { "Content-Type": "application/json" },
            responseType: "arraybuffer",
        });

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