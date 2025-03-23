const axios = require("axios");
const fs = require("fs");

module.exports = async (context) => {
    const { client, m, mime, quoted } = context;

    // Check if the message contains an image or the user replied to an image
    const isImage = m.type === "imageMessage";
    const isQuotedImage = quoted && quoted.type === "imageMessage";

    if (!isImage && !isQuotedImage) {
        return m.reply("❌ *Please send an image with the caption `.removebg` or reply to an image with `.removebg` to remove its background!*");
    }

    try {
        // Notify the user that the process has started
        await client.sendMessage(m.chat, { 
            text: "🖼️ *Removing background... Please wait!* ⏳" 
        });

        // Download the image (either from the sent message or a quoted reply)
        const media = isImage ? await client.downloadMediaMessage(m) : await client.downloadMediaMessage(quoted);

        // Save the image temporarily
        const filePath = "/tmp/image.png";
        fs.writeFileSync(filePath, media);

        // Send image to RemoveBG API
        const apiUrl = `https://fastrestapis.fasturl.cloud/aiimage/removebg?type=auto&shadow=false`;
        const response = await axios.post(apiUrl, fs.createReadStream(filePath), {
            headers: { "Content-Type": "multipart/form-data" },
            responseType: "arraybuffer",
        });

        // Delete temp image after processing
        fs.unlinkSync(filePath);

        // Send the processed image back
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