const axios = require("axios");

module.exports = async (context) => {
    const { client, m, mime } = context;

    if (!m.hasMedia || !mime.startsWith("image/")) {
        return m.reply("❌ *Please send an image with the caption `.removebg` to remove its background!*");
    }

    try {
        // Notify the user that the process has started
        await client.sendMessage(m.chat, { 
            text: "🖼️ *Removing background... Please wait!* ⏳" 
        });

        // Download the image
        const media = await m.download();
        
        // Upload image to API
        const formData = new FormData();
        formData.append("image", media, { filename: "image.png" });

        // API request
        const apiUrl = `https://fastrestapis.fasturl.cloud/aiimage/removebg?type=auto&shadow=false`;
        const response = await axios.post(apiUrl, formData, {
            headers: { "Content-Type": "multipart/form-data" },
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