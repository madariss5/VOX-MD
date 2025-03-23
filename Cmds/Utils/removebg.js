const axios = require("axios");

module.exports = async (context) => {
    const { client, m, text, mime, quoted } = context;

    // Check if the message contains an image or if the user replied to one
    const isImage = m.hasMedia && mime.startsWith("image/");
    const isQuotedImage = quoted && quoted.mtype === "imageMessage";

    if (!isImage && !isQuotedImage) {
        return m.reply("❌ *Please send an image with the caption `.removebg` or reply to an image with `.removebg` to remove its background!*");
    }

    try {
        // Notify the user that the process has started
        await client.sendMessage(m.chat, { 
            text: "🖼️ *Removing background... Please wait!* ⏳" 
        });

        // Download the image (either from the original message or a quoted reply)
        const media = isImage ? await m.downloadMediaMessage() : await quoted.downloadMediaMessage();

        // Convert image to buffer and upload to API
        const formData = new FormData();
        formData.append("image", media, { filename: "image.png" });

        const apiUrl = "https://fastrestapis.fasturl.cloud/aiimage/removebg?type=auto&shadow=false";
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